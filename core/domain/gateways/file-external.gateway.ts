import { FileExternal } from "../entities/file-external";

export interface FileExternalGateway {
	findOne(query: string): Promise<FileExternal>;
	findRelevant(query: string): Promise<FileExternal[]>;
	findRelevant(query: string, max: number): Promise<FileExternal[]>;
}
