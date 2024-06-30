import { Logger } from "winston";
import { z } from "zod";

import { PostService } from "@/core/domain/services/post.service";
import { ReportService } from "@/core/domain/services/report.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { daysBetween } from "@/lib/time";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const reportService = container.get<ReportService>(Registry.ReportService);
const postService = container.get<PostService>(Registry.PostService);
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
			const lastReport = await reportService.findFirstByPostAndUser(input.postId, ctx.auth.userId);
			if (lastReport?.createdAt && daysBetween(lastReport.createdAt, new Date()) < 7) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "Você já denunciou esta postagem recentemente.",
				});
			}

			const post = await postService.findById(input.postId);
			if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Postagem não encontrada." });
			if (post.uploader.externalId === ctx.auth.userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Você não pode denunciar sua própria postagem.",
				});
			}

			try {
				const report = await reportService.create({
					postId: input.postId,
					externalId: ctx.auth.userId,
					motive: input.motive,
					description: input.description,
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
