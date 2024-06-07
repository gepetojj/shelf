import type { File as IFile } from "@/entities/File";
import { now } from "@/lib/time";
import { storage } from "@/models/firebase";

export interface UploadFileProps {
	file: File;
	uploader: string;
	bookId: string;
}

export interface UploadFileReturn {
	file: IFile;
	rollback: () => Promise<void>;
}

export const uploadFile = async ({ file, uploader, bookId }: UploadFileProps): Promise<UploadFileReturn> => {
	const name = crypto.randomUUID();
	const fullname = name + ".pdf";
	const data: IFile = {
		id: crypto.randomUUID(),
		bookId,
		name,
		fullname,
		mime: file.type,
		size: file.size,
		location: `pdfs/${fullname}`,
		meta: {
			uploadedBy: uploader,
			uploadedAt: now(),
			originalName: "",
			originalMime: file.type,
			originalSize: file.size,
		},
	};

	const buffer = Buffer.from(await file.arrayBuffer());
	await storage.file(data.location).save(buffer);
	const rollback = async () => {
		await storage.file(data.location).delete();
	};

	return { file: data, rollback };
};
