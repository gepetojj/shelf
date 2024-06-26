import { uploadChunk } from "../server/upload-chunk";
import { uploadFinal } from "../server/upload-final";
import { chunkChopping } from "./chunk-chopping";
import { chunksIntegrity } from "./chunk-integrity";

export type SubmissionFields = {
	identifier?: string;
	title: string;
	description: string;
	authors?: string[];
	publishers?: string[];
	disciplines: string[];
	topics: string[];
	file: File;
	userId: string;
	thumbnailUrl?: string;
	thumbnailAltUrl?: string;
};

export const submission = async (fields: SubmissionFields) => {
	const groups = chunkChopping(fields.file);
	const chunks = await chunksIntegrity(groups);
	const uploadId = crypto.randomUUID();
	const startedAt = new Date().valueOf();

	for (let index = 0; index < chunks.length; index++) {
		const { chunk, checksum } = chunks[index];
		const data = new FormData();
		data.append("chunk", chunk);
		data.append("checksum", checksum);
		data.append("chunkIndex", index.toString());
		data.append("totalChunks", chunks.length.toString());
		data.append("uploadId", uploadId);
		data.append("userId", fields.userId);
		data.append("startedAt", startedAt.toString());

		if (index === chunks.length - 1) {
			const response = await uploadFinal(
				{
					disciplines: fields.disciplines,
					topics: fields.topics,
					book: {
						title: fields.title,
						subtitle: "",
						authors: fields.authors || [],
						publishers: fields.publishers || [],
						description: fields.description,
						identifier: fields.identifier,
						thumbnailUrl: fields.thumbnailUrl,
						thumbnailAltUrl: fields.thumbnailAltUrl,
					},
					checksum,
					chunkIndex: index,
					totalChunks: chunks.length,
					uploadId,
					userId: fields.userId,
					startedAt,
				},
				data,
			);
			return response;
		}

		const { success, message } = await uploadChunk(data);
		if (!success) return { success, message };
	}

	return { success: true, message: "Sucesso." };
};
