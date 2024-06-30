import { Logger } from "winston";

import { PostService } from "@/core/domain/services/post.service";
import { UnknownError } from "@/errors/infra";
import { Prisma, PrismaClient } from "@prisma/client";

export class PostServiceImpl implements PostService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findById(id: string): Promise<Prisma.PostGetPayload<{ include: { uploader: true } }> | null> {
		try {
			return await this.database.post.findUnique({
				where: { id },
				include: { uploader: true },
			});
		} catch (err: any) {
			this.logger.error(`[post_service:find_by_id] Failed to find post: ${err.message || "No message"}`);
			this.logger.debug("[post_service:find_by_id] Error details:", {
				error: JSON.stringify(err),
				id,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar o post.",
				location: "post_service:find_by_id",
				context: { err, id },
			});
		}
	}
}
