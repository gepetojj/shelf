import { z } from "zod";

import { CommentService } from "@/core/domain/services/comment.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

const service = container.get<CommentService>(Registry.CommentService);

export const commentsRouter = createTRPCRouter({
	list: publicProcedure.input(z.object({ bookId: z.string().uuid() })).query(async ({ input }) => {
		const data = await service.findByPostId(input.bookId);
		return data;
	}),

	create: protectedProcedure
		.input(
			z.object({ bookId: z.string().uuid(), parentId: z.string().uuid().optional(), text: z.string().max(300) }),
		)
		.mutation(async ({ input, ctx }) => {
			const data = await service.create({
				externalId: ctx.auth.userId,
				postId: input.bookId,
				parentId: input.parentId,
				text: input.text,
			});
			return data;
		}),
});
