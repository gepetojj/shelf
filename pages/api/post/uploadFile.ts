import formidable from "formidable";

import type { File } from "@/entities/File";
import { now } from "@/lib/time";
import { storage } from "@/models/firebase";

export interface UploadFileProps {
	file: formidable.File;
	uploader: string;
	bookId: string;
}

export interface UploadFileReturn {
	file: File;
	rollback: () => Promise<void>;
}

export const uploadFile = async ({ file, uploader, bookId }: UploadFileProps): Promise<UploadFileReturn> => {
	const fullname = file.newFilename + "." + file.originalFilename?.split(".").reverse()[0];
	const data: File = {
		id: crypto.randomUUID(),
		bookId,
		name: file.newFilename,
		fullname,
		mime: file.mimetype || "",
		size: file.size,
		location: `epubs/${fullname}`,
		meta: {
			uploadedBy: uploader,
			uploadedAt: now(),
			originalName: file.originalFilename || "",
			originalMime: file.mimetype || "",
			originalSize: file.size,
		},
	};

	await storage.file(data.location).save(file.filepath);
	const rollback = async () => {
		await storage.file(data.location).delete();
	};

	return { file: data, rollback };
};
