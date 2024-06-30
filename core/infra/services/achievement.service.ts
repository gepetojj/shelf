import { Logger } from "winston";

import { AchievementService } from "@/core/domain/services/achievement.service";
import { UnknownError } from "@/errors/infra";
import { Prisma, PrismaClient } from "@prisma/client";

export class AchievementServiceImpl implements AchievementService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findByExternalId(externalId: string): Promise<Prisma.AchievementGetPayload<{}>[]> {
		try {
			return await this.database.achievement.findMany({ where: { user: { externalId } } });
		} catch (err: any) {
			this.logger.error(
				`[achievement_service:find_by_external_id] Failed to find achievements: ${err.message || "No message"}`,
			);
			this.logger.debug("[achievement_service:find_by_external_id] Error details:", {
				error: JSON.stringify(err),
				externalId,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar as conquistas.",
				location: "achievement_service:find_by_external_id",
				context: { err, externalId },
			});
		}
	}
}
