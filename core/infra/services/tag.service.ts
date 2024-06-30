import { Logger } from "winston";

import { TagService } from "@/core/domain/services/tag.service";
import { UnknownError } from "@/errors/infra";
import { Prisma, PrismaClient } from "@prisma/client";

export class TagServiceImpl implements TagService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findAll<I extends Prisma.TagInclude>(
		include?: I,
	): Promise<Prisma.TagGetPayload<{ include: { posts: true } }>[]> {
		try {
			// @ts-expect-error Incluir os posts é opcional mas o typescript não suporta essa manipulação de tipos.
			return await this.database.tag.findMany({ include });
		} catch (err: any) {
			this.logger.error(`[tag_service:find_all] Failed to find tags: ${err.message || "No message"}`);
			this.logger.debug("[tag_service:find_all] Error details:", { error: JSON.stringify(err) });
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar as tags.",
				location: "tag_service:find_all",
				context: { err, include },
			});
		}
	}

	async findById(id: string) {
		try {
			return await this.database.tag.findUnique({ where: { id } });
		} catch (err: any) {
			this.logger.error(`[tag_service:find_by_id] Failed to find tag: ${err.message || "No message"}`);
			this.logger.debug("[tag_service:find_by_id] Error details:", { error: JSON.stringify(err), id });
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar a tag.",
				location: "tag_service:find_by_id",
				context: { err, id },
			});
		}
	}

	async search(query: string) {
		try {
			return await this.database.tag.findMany({ where: { name: { search: query } } });
		} catch (err: any) {
			this.logger.error(`[tag_service:search] Failed to search tags: ${err.message || "No message"}`);
			this.logger.debug("[tag_service:search] Error details:", { error: JSON.stringify(err), query });
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar as tags.",
				location: "tag_service:search",
				context: { err, query },
			});
		}
	}
}
