import { Logger } from "winston";

import { StorageRepository } from "@/core/domain/repositories/storage.repository";
import { container } from "@/core/infra/container";
import { Registry } from "@/core/infra/container/registry";

const storage = container.get<StorageRepository>(Registry.StorageRepository);
const logger = container.get<Logger>(Registry.Logger);

export const assembleChunks = async (finalChunk: Blob, chunksLen: number, basePath: string) => {
	if (chunksLen === 1) {
		return Buffer.from(await finalChunk.arrayBuffer());
	}

	const parts: Buffer[] = [];

	for (let index = 0; index < chunksLen; index++) {
		if (index === chunksLen - 1) {
			parts.push(Buffer.from(await finalChunk.arrayBuffer()));
			continue;
		}

		const path = `${basePath}/${index}`;
		try {
			const chunk = await storage.findOne(path);
			parts.push(chunk);
		} catch (err: any) {
			logger.error("Error reading chunk", { path, error: err });
			throw new Error("Erro ao ler o chunk.");
		}
	}

	return Buffer.concat(parts);
};
