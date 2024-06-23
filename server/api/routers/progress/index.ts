import { Logger } from "winston";
import { z } from "zod";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = new PrismaClient();
const logger = container.get<Logger>(Registry.Logger);

export const progressRouter = createTRPCRouter({
	one: protectedProcedure.input(z.object({ bookId: z.string().uuid() })).query(async ({ input, ctx }) => {
		const user = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
			location: "progress_router:one:find_user",
			message: "Não foi possível encontrar o usuário.",
		});
		if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
		const book = await promiseHandler(
			database.post.findUnique({ where: { id: input.bookId }, include: { files: true } }),
			{
				location: "progress_router:one:find_book",
				message: "Não foi possível encontrar o livro.",
			},
		);
		if (!book) throw new TRPCError({ code: "NOT_FOUND", message: "Livro não encontrado." });

		const data = await promiseHandler(
			database.progress.findUnique({
				where: {
					userId_bookId_fileId: { userId: user.id, bookId: input.bookId, fileId: book.files[0].id },
				},
			}),
			{ location: "progress_router:one:find_progress", message: "Não foi possível encontrar o progresso." },
		);
		if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Postagem não encontrada." });
		return data;
	}),

	list: protectedProcedure.query(async ({ input, ctx }) => {
		try {
			const data = await database.progress.findMany({
				where: { user: { externalId: ctx.auth.userId } },
				include: { book: true },
			});
			return data;
		} catch (err: any) {
			logger.error(`[progress_router:list] Failed to list progress: ${err.message}`, { input, err });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Não foi possível listar o progresso salvo.",
			});
		}
	}),

	upsert: protectedProcedure
		.input(z.object({ bookId: z.string().uuid(), page: z.coerce.number().min(1).max(9999) }))
		.mutation(async ({ input, ctx }) => {
			const user = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
				location: "progress_router:one:find_user",
				message: "Não foi possível encontrar o usuário.",
			});
			if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
			const book = await promiseHandler(
				database.post.findUnique({ where: { id: input.bookId }, include: { files: true } }),
				{
					location: "progress_router:one:find_book",
					message: "Não foi possível encontrar o livro.",
				},
			);
			if (!book) throw new TRPCError({ code: "NOT_FOUND", message: "Livro não encontrado." });

			const data = await promiseHandler(
				database.progress.upsert({
					where: {
						userId_bookId_fileId: { userId: user.id, bookId: input.bookId, fileId: book.files[0].id },
					},
					create: {
						userId: user.id,
						bookId: input.bookId,
						fileId: book.files[0].id,
						page: input.page,
					},
					update: {
						page: input.page,
					},
				}),
				{ location: "progress_router:upsert:upsert_progress", message: "Não foi possível salvar o progresso." },
			);
			return data;
		}),
});
