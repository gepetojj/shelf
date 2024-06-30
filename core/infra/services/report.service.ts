import { Logger } from "winston";

import { ReportCreateDTO, ReportService } from "@/core/domain/services/report.service";
import { UnknownError } from "@/errors/infra";
import { PrismaClient } from "@prisma/client";

export class ReportServiceImpl implements ReportService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findFirstByPostAndUser(postId: string, externalId: string) {
		try {
			return await this.database.report.findFirst({
				where: { postId, user: { externalId: externalId } },
				orderBy: { createdAt: "desc" },
			});
		} catch (err: any) {
			this.logger.error(
				`[report_service:find_first_by_post_and_user] Failed to find report: ${err.message || "No message"}`,
			);
			this.logger.debug("[report_service:find_first_by_post_and_user] Error details:", {
				error: JSON.stringify(err),
				postId,
				externalId,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar a denúncia.",
				location: "report_service:find_first_by_post_and_user",
				context: { err, postId, externalId },
			});
		}
	}

	async create(input: ReportCreateDTO) {
		try {
			return await this.database.report.create({
				data: {
					post: { connect: { id: input.postId } },
					user: { connect: { externalId: input.externalId } },
					motive: input.motive,
					description: input.description,
				},
			});
		} catch (err: any) {
			this.logger.error(`[report_service:create] Failed to create report: ${err.message || "No message"}`);
			this.logger.debug("[report_service:create] Error details:", { error: JSON.stringify(err), input });
			throw new UnknownError({
				message: err.message || "Houve um erro ao criar a denúncia.",
				location: "report_service:create",
				context: { err, input },
			});
		}
	}
}
