import { Logger } from "winston";
import { z } from "zod";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = container.get<PrismaClient>(Registry.Prisma);
const logger = container.get<Logger>(Registry.Logger);

export const commentsRouter = createTRPCRouter({
	list: publicProcedure.input(z.object({ bookId: z.string().uuid() })).query(async ({ input }) => {
		try {
			const data = await database.comment.findMany({
				where: { postId: input.bookId },
				include: { children: true, owner: true },
			});
			return data;
		} catch (err: any) {
			logger.error(`[comments_router:list] Failed to list comments: ${err.message}`, { input, err });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Não foi possível listar os comentários.",
			});
		}
	}),

	create: protectedProcedure
		.input(
			z.object({ bookId: z.string().uuid(), parentId: z.string().uuid().optional(), text: z.string().max(300) }),
		)
		.mutation(async ({ input, ctx }) => {
			const data = await promiseHandler(
				database.comment.create({
					data: {
						owner: { connect: { externalId: ctx.auth.userId } },
						post: { connect: { id: input.bookId } },
						parent: input.parentId ? { connect: { id: input.parentId } } : undefined,
						textContent: input.text,
					},
					include: { owner: true, children: true },
				}),
				{ location: "comments_router:create", message: "Não foi possível postar o comentário." },
			);
			return data;
		}),
});
