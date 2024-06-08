import { Readable } from "stream";
import { Logger } from "winston";

import { StorageRepository } from "@/core/domain/repositories/storage.repository";
import { ResourceNotFound, UnknownError } from "@/errors/infra";
import { storage } from "@/models/firebase";

export class FirebaseStorageRepository implements StorageRepository {
	constructor(private logger: Logger) {}

	async findOne(location: string): Promise<Buffer> {
		try {
			const file = await storage.file(location).download();
			if (!file[0]) throw new ResourceNotFound({ location: "firebase_storage:find_one", context: { location } });
			const buffer = file[0];
			return buffer;
		} catch (err: any) {
			if (err instanceof ResourceNotFound) throw err;

			this.logger.error("Failed to find file", {
				err: err.message || err.stack || err,
				location,
			});
			throw new UnknownError({
				message: "Erro ao buscar documento no armazenamento.",
				location: "firebase_storage:find_one",
				context: { location },
			});
		}
	}

	streamOne(location: string): Readable {
		try {
			const file = storage.file(location).createReadStream();
			return file;
		} catch (err: any) {
			this.logger.error("Failed to stream file", {
				err: err.message || err.stack || err,
				location,
			});
			throw new UnknownError({
				message: "Erro ao buscar documento no armazenamento.",
				location: "firebase_storage:stream_one",
				context: { location },
			});
		}
	}

	async create(location: string, data: Buffer): Promise<void> {
		try {
			return await storage.file(location).save(data);
		} catch (err: any) {
			this.logger.error("Failed to create file", {
				err: err.message || err.stack || err,
				location,
			});
			throw new UnknownError({
				message: "Erro ao criar o documento no armazenamento.",
				location: "firebase_storage:stream_one",
				context: { location },
			});
		}
	}

	async delete(location: string): Promise<void> {
		try {
			const [response] = await storage.file(location).delete();
			if (response.statusCode >= 400) throw new Error("Failed to delete file.");
		} catch (err: any) {
			this.logger.error("Failed to create file", {
				err: err.message || err.stack || err,
				location,
			});
			throw new UnknownError({
				message: "Erro ao criar o documento no armazenamento.",
				location: "firebase_storage:stream_one",
				context: { location },
			});
		}
	}
}
