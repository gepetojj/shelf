import { Logger } from "winston";

import type { UserService } from "@/core/domain/services/user.service";
import { UnknownError } from "@/errors/infra";
import { Prisma, PrismaClient } from "@prisma/client";

export class UserServiceImpl implements UserService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findByExternalId(externalId: string): Promise<Prisma.UserGetPayload<{}> | null> {
		try {
			return await this.database.user.findUnique({ where: { externalId } });
		} catch (err: any) {
			this.logger.error(`[user_service:find_by_external_id] Failed to find user: ${err.message || "No message"}`);
			this.logger.debug("[user_service:find_by_external_id] Error details:", {
				error: JSON.stringify(err),
				externalId,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar o usuário.",
				location: "user_service:find_by_external_id",
				context: { err, externalId },
			});
		}
	}
}
