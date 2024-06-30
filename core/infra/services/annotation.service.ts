import { Logger } from "winston";

import { AnnotationId, AnnotationService, AnnotationUpsertDTO } from "@/core/domain/services/annotation.service";
import { UnknownError } from "@/errors/infra";
import { Prisma, PrismaClient } from "@prisma/client";

export class AnnotationServiceImpl implements AnnotationService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findById(id: AnnotationId): Promise<Prisma.AnnotationGetPayload<{}> | null> {
		try {
			return await this.database.annotation.findUnique({
				where: {
					ownerId_postId_page_textContent: {
						ownerId: id.ownerId,
						postId: id.postId,
						page: id.page,
						textContent: id.textContent,
					},
				},
			});
		} catch (err: any) {
			this.logger.error(
				`[annotation_service:find_by_id] Failed to find annotation: ${err.message || "No message"}`,
			);
			this.logger.debug("[annotation_service:find_by_id] Error details:", {
				error: JSON.stringify(err),
				id,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar a anotação.",
				location: "annotation_service:find_by_id",
				context: { err, id },
			});
		}
	}

	async findByPostAndOwner(postId: string, ownerId: string): Promise<Prisma.AnnotationGetPayload<{}>[]> {
		try {
			return await this.database.annotation.findMany({
				where: { owner: { externalId: ownerId }, postId },
			});
		} catch (err: any) {
			this.logger.error(
				`[annotation_service:find_by_post_and_owner] Failed to find annotations: ${err.message || "No message"}`,
			);
			this.logger.debug("[annotation_service:find_by_post_and_owner] Error details:", {
				error: JSON.stringify(err),
				postId,
				ownerId,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar as anotações.",
				location: "annotation_service:find_by_post_and_owner",
				context: { err, postId, ownerId },
			});
		}
	}

	async upsert(data: AnnotationUpsertDTO): Promise<Prisma.AnnotationGetPayload<{}>> {
		try {
			return await this.database.annotation.upsert({
				where: {
					ownerId_postId_page_textContent: {
						ownerId: data.onCreate.ownerId,
						postId: data.onCreate.postId,
						page: data.onCreate.page,
						textContent: data.onCreate.textContent,
					},
				},
				create: {
					owner: { connect: { externalId: data.onCreate.ownerId } },
					post: { connect: { id: data.onCreate.postId } },
					page: data.onCreate.page,
					textContent: data.onCreate.textContent,
					substrings: data.substrings,
					comment: data.comment,
				},
				update: {
					substrings: data.substrings,
					comment: data.comment,
				},
			});
		} catch (err: any) {
			this.logger.error(
				`[annotation_service:upsert] Failed to upsert annotation: ${err.message || "No message"}`,
			);
			this.logger.debug("[annotation_service:upsert] Error details:", {
				error: JSON.stringify(err),
				data,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao salvar a anotação.",
				location: "annotation_service:upsert",
				context: { err, data },
			});
		}
	}

	async delete(id: AnnotationId): Promise<void> {
		try {
			await this.database.annotation.delete({
				where: {
					ownerId_postId_page_textContent: {
						ownerId: id.ownerId,
						postId: id.postId,
						page: id.page,
						textContent: id.textContent,
					},
				},
			});
		} catch (err: any) {
			this.logger.error(
				`[annotation_service:delete] Failed to delete annotation: ${err.message || "No message"}`,
			);
			this.logger.debug("[annotation_service:delete] Error details:", {
				error: JSON.stringify(err),
				id,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao deletar a anotação.",
				location: "annotation_service:delete",
				context: { err, id },
			});
		}
	}
}
