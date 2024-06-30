import { Logger } from "winston";
import { z } from "zod";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = container.get<PrismaClient>(Registry.Prisma);
const logger = container.get<Logger>(Registry.Logger);

export const fileAnnotationsRouter = createTRPCRouter({
	list: protectedProcedure.input(z.object({ fileId: z.string().uuid() })).query(async ({ input, ctx }) => {
		try {
			const data = await database.annotation.findMany({
				where: { owner: { externalId: ctx.auth.userId }, postId: input.fileId },
			});
			return data;
		} catch (err: any) {
			logger.error(`[file_annotations_router:list] Failed to list annotations: ${err.message}`, {
				input,
				ctx,
				err,
			});
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível listar as anotações." });
		}
	}),

	highlight: protectedProcedure
		.input(
			z.object({
				fileId: z.string().uuid(),
				page: z.coerce.number().min(1).max(9999),
				text: z.string(),
				substrings: z.record(
					z.coerce.number().min(0),
					z.object({ start: z.number().min(0), end: z.number().min(0) }),
				),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const owner = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
				location: "file_annotations_router:highlight:find_user",
				message: "Não foi possível encontrar o usuário.",
			});
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await promiseHandler(
				database.annotation.upsert({
					where: {
						ownerId_postId_page_textContent: {
							ownerId: owner.id,
							postId: input.fileId,
							page: input.page,
							textContent: input.text,
						},
					},
					create: {
						owner: { connect: { externalId: ctx.auth.userId } },
						post: { connect: { id: input.fileId } },
						page: input.page,
						textContent: input.text,
						substrings: input.substrings,
					},
					update: {
						substrings: input.substrings,
					},
				}),
				{
					location: "file_annotations_router:highlight:upsert_annotation",
					message: "Não foi possível criar/atualizar a anotação.",
				},
			);
			return data;
		}),

	comment: protectedProcedure
		.input(
			z.object({
				fileId: z.string().uuid(),
				page: z.coerce.number().min(1).max(9999),
				text: z.string(),
				substrings: z.record(
					z.coerce.number().min(0),
					z.object({ start: z.number().min(0), end: z.number().min(0) }),
				),
				comment: z.string().trim().min(1).max(500),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const owner = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
				location: "file_annotations_router:comment:find_user",
				message: "Não foi possível encontrar o usuário.",
			});
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await promiseHandler(
				database.annotation.upsert({
					where: {
						ownerId_postId_page_textContent: {
							ownerId: owner.id,
							postId: input.fileId,
							page: input.page,
							textContent: input.text,
						},
					},
					create: {
						owner: { connect: { externalId: ctx.auth.userId } },
						post: { connect: { id: input.fileId } },
						page: input.page,
						textContent: input.text,
						comment: input.comment,
						substrings: input.substrings,
					},
					update: {
						substrings: input.substrings,
						comment: input.comment,
					},
				}),
				{
					location: "file_annotations_router:comment:upsert_annotation",
					message: "Não foi possível criar/atualizar a anotação.",
				},
			);
			return data;
		}),

	delete: protectedProcedure
		.input(z.object({ postId: z.string().uuid(), page: z.coerce.number().min(1).max(9999), text: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const owner = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
				location: "file_annotations_router:comment:find_user",
				message: "Não foi possível encontrar o usuário.",
			});
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await promiseHandler(
				database.annotation.findUnique({
					where: {
						ownerId_postId_page_textContent: {
							ownerId: owner.id,
							postId: input.postId,
							page: input.page,
							textContent: input.text,
						},
					},
				}),
				{
					location: "file_annotations_router:delete:find_annotation",
					message: "Não foi possível encontrar a anotação.",
				},
			);
			if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Anotação não encontrada." });

			await promiseHandler(
				database.annotation.delete({
					where: {
						ownerId_postId_page_textContent: {
							ownerId: owner.id,
							postId: input.postId,
							page: input.page,
							textContent: input.text,
						},
					},
				}),
				{
					location: "file_annotations_router:delete:delete_annotation",
					message: "Não foi possível deletar a anotação.",
				},
			);
		}),
});
