import { Readable } from "stream";

export interface StorageRepository {
	findOne(location: string): Promise<Buffer>;
	streamOne(location: string): Readable;
	create(location: string, data: Buffer): Promise<void>;
	delete(location: string): Promise<void>;
}
