"use server";

import { Logger } from "winston";
import { z } from "zod";

import { StorageRepository } from "@/core/domain/repositories/storage.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { megaToBytes } from "@/lib/bytes";

import { integrityCheck } from "./integrity-check";

const inputs = z.object({
	chunk: z
		.custom<Blob>()
		.refine(chunk => chunk && chunk.size <= megaToBytes(3), {
			message: "O chunk enviado é maior que o limite de 3MB.",
		})
		.refine(chunk => chunk && chunk.type === "application/octet-stream", {
			message: "O arquivo enviado não é um chunk.",
		}),
	checksum: z.string(),
	chunkIndex: z.coerce.number().min(0).max(999),
	totalChunks: z.coerce.number().min(1).max(999),
	uploadId: z.string().uuid(),
	userId: z.string().startsWith("user_"),
	startedAt: z.coerce.number(),
});

type Outputs = {
	success: boolean;
	message: string;
};

const storage = container.get<StorageRepository>(Registry.StorageRepository);
const logger = container.get<Logger>(Registry.Logger);

export const uploadChunk = async (form: FormData): Promise<Outputs> => {
	const data = inputs.parse(Object.fromEntries(form));
	const { chunk, checksum, chunkIndex, uploadId, startedAt } = data;

	try {
		const receivedChunkChecksum = await integrityCheck(chunk);
		if (receivedChunkChecksum !== checksum) {
			logger.error("Checksum mismatch", { data });
			return { success: false, message: "O chunk enviado não corresponde ao chunk recebido." };
		}
	} catch (err: any) {
		logger.error("Error checking chunk checksum", { data, error: err });
		return { success: false, message: "Erro ao processar o chunk." };
	}

	try {
		const path = `chunk_uploads/${startedAt}_${uploadId}/${chunkIndex}`;
		const buffer = Buffer.from(await chunk.arrayBuffer());
		await storage.create(path, buffer);
	} catch (err: any) {
		logger.error("Error saving chunk", { data, error: err });
		return { success: false, message: "Erro ao salvar o chunk." };
	}

	return { success: true, message: "Chunk salvo com sucesso." };
};
