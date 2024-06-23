import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = new PrismaClient();

export const fileAnnotationsRouter = createTRPCRouter({
	list: protectedProcedure.input(z.object({ fileId: z.string().uuid() })).query(async ({ input, ctx }) => {
		const data = await database.annotation.findMany({
			where: { owner: { externalId: ctx.auth.userId }, postId: input.fileId },
		});
		return data;
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
			const owner = await database.user.findUnique({ where: { externalId: ctx.auth.userId } });
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await database.annotation.upsert({
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
			});
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
			const owner = await database.user.findUnique({ where: { externalId: ctx.auth.userId } });
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await database.annotation.upsert({
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
			});
			return data;
		}),

	delete: protectedProcedure
		.input(z.object({ postId: z.string().uuid(), page: z.coerce.number().min(1).max(9999), text: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const owner = await database.user.findUnique({ where: { externalId: ctx.auth.userId } });
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await database.annotation.findUnique({
				where: {
					ownerId_postId_page_textContent: {
						ownerId: owner.id,
						postId: input.postId,
						page: input.page,
						textContent: input.text,
					},
				},
			});
			if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Anotação não encontrada." });

			await database.annotation.delete({
				where: {
					ownerId_postId_page_textContent: {
						ownerId: owner.id,
						postId: input.postId,
						page: input.page,
						textContent: input.text,
					},
				},
			});
		}),
});
