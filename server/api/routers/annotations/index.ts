import { z } from "zod";

import { AnnotationService } from "@/core/domain/services/annotation.service";
import { UserService } from "@/core/domain/services/user.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const annotationService = container.get<AnnotationService>(Registry.AnnotationService);
const userService = container.get<UserService>(Registry.UserService);

export const annotationsRouter = createTRPCRouter({
	list: protectedProcedure.input(z.object({ fileId: z.string().uuid() })).query(async ({ input, ctx }) => {
		return await annotationService.findByPostAndOwner(input.fileId, ctx.auth.userId);
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
			const owner = await userService.findByExternalId(ctx.auth.userId);
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await annotationService.upsert({
				substrings: input.substrings,
				onCreate: {
					ownerId: owner.id,
					postId: input.fileId,
					page: input.page,
					textContent: input.text,
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
			const owner = await userService.findByExternalId(ctx.auth.userId);
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await annotationService.upsert({
				substrings: input.substrings,
				comment: input.comment,
				onCreate: {
					ownerId: owner.id,
					postId: input.fileId,
					page: input.page,
					textContent: input.text,
				},
			});
			return data;
		}),

	delete: protectedProcedure
		.input(z.object({ postId: z.string().uuid(), page: z.coerce.number().min(1).max(9999), text: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const owner = await userService.findByExternalId(ctx.auth.userId);
			if (!owner) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

			const data = await annotationService.findById({
				ownerId: owner.id,
				postId: input.postId,
				page: input.page,
				textContent: input.text,
			});
			if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Anotação não encontrada." });

			await annotationService.delete({
				ownerId: owner.id,
				postId: input.postId,
				page: input.page,
				textContent: input.text,
			});
		}),
});
