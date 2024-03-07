import { z } from "zod";

import { storage } from "@/models/firebase";

export const dynamic = "force-dynamic";

const schema = z.object({
	location: z.string().trim(),
});

export async function GET(_request: Request, { params }: { params: { location: string } }) {
	const { location } = schema.parse(params);
	const response = await storage.file(`epubs/${location}`).download();

	if (!response || !response.length) return new Response("Arquivo não encontrado", { status: 404 });
	const buffer = response[0];

	return new Response(buffer, {
		headers: {
			"Content-Type": "application/epub+zip",
		},
	});
}
