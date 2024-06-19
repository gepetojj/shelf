import { z } from "zod";

import { StorageRepository } from "@/core/domain/repositories/storage.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { api, handlerConfig } from "@/models/api";

const router = api();

const getHandlerInputs = z.object({
	location: z.string(),
});

router.get(async req => {
	const entries = req.nextUrl.searchParams.entries();
	const { location } = getHandlerInputs.parse(Object.fromEntries(entries));

	const fileStream = container.get<StorageRepository>(Registry.StorageRepository).streamOne(location);
	const iterator = fileStream.iterator();

	const stream = new ReadableStream({
		async start(controller) {
			for await (const chunk of iterator) {
				controller.enqueue(chunk);
			}
			controller.close();
		},
	});

	// TODO: Get file type
	return new Response(stream);
});

const handler = router.handler(handlerConfig);
export { handler as GET };
