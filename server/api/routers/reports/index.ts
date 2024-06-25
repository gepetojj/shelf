import { Logger } from "winston";
import { z } from "zod";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { daysBetween } from "@/lib/time";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = new PrismaClient();
const logger = container.get<Logger>(Registry.Logger);

export const reportsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				postId: z.string().uuid(),
				motive: z.enum(["OFFENSIVE", "INAPPROPRIATE", "SPAM", "OTHER"]),
				description: z.string().max(700).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const lastReport = await promiseHandler(
				database.report.findFirst({
					where: { postId: input.postId, user: { externalId: ctx.auth.userId } },
					orderBy: { createdAt: "desc" },
				}),
				{
					location: "reports_router:create:find_last_report",
					message: "Não foi possível encontrar a última denúncia.",
				},
			);

			if (lastReport?.createdAt && daysBetween(lastReport.createdAt, new Date()) < 7) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "Você já denunciou esta postagem recentemente.",
				});
			}

			const post = await promiseHandler(
				database.post.findUnique({ where: { id: input.postId }, include: { uploader: true } }),
				{
					location: "reports_router:create:find_post",
					message: "Não foi possível encontrar a postagem.",
				},
			);

			if (!post) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Postagem não encontrada." });
			}
			if (post.uploader.externalId === ctx.auth.userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Você não pode denunciar sua própria postagem.",
				});
			}

			try {
				const report = await database.report.create({
					data: {
						post: { connect: { id: input.postId } },
						user: { connect: { externalId: ctx.auth.userId } },
						motive: input.motive,
						description: input.description,
					},
				});
				return report;
			} catch (err: any) {
				logger.error(`[reports_router:create] Failed to create report: ${err.message}`, { input, err });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Não foi possível criar a denúncia.",
				});
			}
		}),
});
