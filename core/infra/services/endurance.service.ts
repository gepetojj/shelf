import { Logger } from "winston";

import { EnduranceService } from "@/core/domain/services/endurance.service";
import { UnknownError } from "@/errors/infra";
import { DAY, removeTime } from "@/lib/time";
import { Prisma, PrismaClient } from "@prisma/client";

export class EnduranceServiceImpl implements EnduranceService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findByUserId(userId: string): Promise<Prisma.EnduranceGetPayload<{}> | null> {
		try {
			return await this.database.endurance.findUnique({
				where: { userId },
			});
		} catch (err: any) {
			this.logger.error(
				`[endurance_service:find_by_user_id] Failed to find endurances: ${err.message || "No message"}`,
			);
			this.logger.debug("[endurance_service:find_by_user_id] Error details:", {
				error: JSON.stringify(err),
				userId,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar os dados de leitura.",
				location: "endurance_service:find_by_user_id",
				context: { err, userId },
			});
		}
	}

	getStreak(sequence: Date[]): number {
		const today = removeTime(new Date());
		let lastDate: Date | undefined = undefined;
		let streak = 0;

		for (let index = sequence.length - 1; index >= 0; index--) {
			const element = sequence[index];
			if (!lastDate) {
				const diff = Math.abs(today.getTime() - element.getTime());
				if (diff > DAY) break;
				lastDate = element;
				streak++;
				continue;
			}

			const diff = Math.abs(lastDate.getTime() - element.getTime());
			if (diff <= DAY) {
				streak++;
				lastDate = element;
			} else {
				break;
			}
		}

		return streak;
	}
}
