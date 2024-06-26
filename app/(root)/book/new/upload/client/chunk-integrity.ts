export const chunksIntegrity = async (chunks: Blob[]) => {
	const chunkIntegrity = chunks.map(async chunk => {
		const buffer = await chunk.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
		return { chunk: chunk, checksum: hashHex };
	});

	return Promise.all(chunkIntegrity);
};
