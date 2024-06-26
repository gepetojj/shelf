import { Logger } from "winston";
import { z } from "zod";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = new PrismaClient();
const logger = container.get<Logger>(Registry.Logger);

export const filesRouter = createTRPCRouter({
	one: publicProcedure
		.input(z.object({ id: z.string().uuid(), comments: z.boolean().optional(), files: z.boolean().optional() }))
		.query(async ({ input }) => {
			try {
				const data = await database.post.findUnique({
					where: { id: input.id },
					include: {
						comments: {
							include: { owner: input.comments, children: input.comments },
							orderBy: { createdAt: "desc" },
						},
						uploader: true,
						tags: { include: { tag: true } },
						files: input.files,
					},
				});
				if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Postagem não encontrada." });
				return data;
			} catch (err: any) {
				logger.error(`[files_router:one] Failed to find post: ${err.message}`, { input, err });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Não foi possível encontrar a postagem.",
				});
			}
		}),

	oneDependents: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
		try {
			const data = await database.post.findUnique({
				where: { id: input.id },
				include: {
					Progress: true,
				},
			});
			if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Postagem não encontrada." });

			// Quantidade de pessoas que iniciaram a leitura
			return data.Progress.length;
		} catch (err: any) {
			logger.error(`[files_router:oneDependents] Failed to find post: ${err.message}`, { input, err });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Não foi possível encontrar a postagem.",
			});
		}
	}),

	list: publicProcedure
		.input(
			z.object({
				offset: z.coerce.number().min(10).max(20).optional().default(10),
				cursor: z.string().uuid().optional(),
				discipline: z.string().optional(),
				topic: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			try {
				const tags = [input.discipline, input.topic].filter(tag => !!tag) as string[];
				const data = await database.post.findMany({
					where: {
						tags: { some: { tag: { id: { contains: tags.length ? tags.join("|") : undefined } } } },
					},
					orderBy: { createdAt: "desc" },
					include: { uploader: true, tags: { include: { tag: true } } },
					take: input.offset,
					skip: input.cursor ? 1 : undefined, // Pula o cursor
					cursor: input.cursor ? { id: input.cursor } : undefined,
				});
				return data;
			} catch (err: any) {
				logger.error(`[files_router:list] Failed to list posts: ${err.message}`, { input, err });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Não foi possível listar as postagens.",
				});
			}
		}),

	search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
		try {
			const data = await database.post.findMany({
				where: {
					OR: [
						{ title: { contains: input.query, mode: "insensitive" } },
						{ authors: { has: input.query } },
						{ tags: { some: { tag: { name: { contains: input.query, mode: "insensitive" } } } } },
					],
				},
				include: { uploader: true, tags: { include: { tag: true } } },
			});
			return data;
		} catch (err: any) {
			logger.error(`[files_router:search] Failed to search posts: ${err.message}`, { input, err });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Não foi possível buscar as postagens.",
			});
		}
	}),

	delete: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ input, ctx }) => {
		const post = await promiseHandler(
			database.post.findUnique({ where: { id: input.id }, include: { uploader: true } }),
			{
				location: "files_router:delete:find_post",
				message: "Não foi possível encontrar a postagem.",
			},
		);

		if (post?.uploader.externalId !== ctx.auth.userId) {
			throw new TRPCError({ code: "FORBIDDEN", message: "Só é possível deletar postagens suas." });
		}

		try {
			const data = await database.post.delete({ where: { id: input.id } });
			return data;
		} catch (err: any) {
			logger.error(`[files_router:delete] Failed to delete post: ${err.message}`, { input, err });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Não foi possível deletar a postagem.",
			});
		}
	}),
});
