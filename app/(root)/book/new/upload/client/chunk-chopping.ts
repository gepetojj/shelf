import { megaToBytes } from "@/lib/bytes";

export const chunkChopping = (file: File) => {
	const chunkSize = megaToBytes(3);
	const totalChunks = Math.ceil(file.size / chunkSize);

	const chunks = Array.from({ length: totalChunks }, (_, i) => {
		const start = i * chunkSize;
		const end = start + chunkSize;
		return file.slice(start, end);
	});

	return chunks;
};
