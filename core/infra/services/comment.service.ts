import { Logger } from "winston";

import { CommentCreateDTO, CommentPayload, CommentService } from "@/core/domain/services/comment.service";
import { UnknownError } from "@/errors/infra";
import { PrismaClient } from "@prisma/client";

export class CommentServiceImpl implements CommentService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findByPostId(postId: string): Promise<CommentPayload[]> {
		try {
			return await this.database.comment.findMany({
				where: { postId },
				include: {
					owner: {
						select: {
							id: true,
							externalId: true,
							firstName: true,
							lastName: true,
							username: true,
							profileImageUrl: true,
						},
					},
					children: true,
				},
			});
		} catch (err: any) {
			this.logger.error(
				`[comment_service:find_by_post_id] Failed to find comments: ${err.message || "No message"}`,
			);
			this.logger.debug("[comment_service:find_by_post_id] Error details:", {
				error: JSON.stringify(err),
				postId,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar os comentários.",
				location: "comment_service:find_by_post_id",
				context: { err, postId },
			});
		}
	}

	async create(data: CommentCreateDTO): Promise<CommentPayload> {
		try {
			return await this.database.comment.create({
				data: {
					owner: { connect: { externalId: data.externalId } },
					post: { connect: { id: data.postId } },
					parent: data.parentId ? { connect: { id: data.parentId } } : undefined,
					textContent: data.text,
				},
				include: {
					owner: {
						select: {
							id: true,
							externalId: true,
							firstName: true,
							lastName: true,
							username: true,
							profileImageUrl: true,
						},
					},
					children: true,
				},
			});
		} catch (err: any) {
			this.logger.error(`[comment_service:create] Failed to create comment: ${err.message || "No message"}`);
			this.logger.debug("[comment_service:create] Error details:", {
				error: JSON.stringify(err),
				data,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao criar o comentário.",
				location: "comment_service:create",
				context: { err, data },
			});
		}
	}
}
