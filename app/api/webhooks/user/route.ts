import { headers } from "next/headers";
import { Webhook } from "svix";
import { Logger } from "winston";
import { z } from "zod";

import { config } from "@/config";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { api, handlerConfig } from "@/models/api";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const router = api();

const getHandlerHeaders = z.object({
	id: z.string(),
	timestamp: z.string(),
	signature: z.string(),
});

const database = new PrismaClient();
const logger = container.get<Logger>(Registry.Logger);

router.post(async req => {
	const payloadHeaders = headers();
	const { id, timestamp, signature } = getHandlerHeaders.parse({
		id: payloadHeaders.get("svix-id"),
		timestamp: payloadHeaders.get("svix-timestamp"),
		signature: payloadHeaders.get("svix-signature"),
	});

	const payload = await req.json();
	const body = JSON.stringify(payload);

	const wh = new Webhook(config.CLERK_USER_WEBHOOK_SECRET);
	let evt: WebhookEvent;

	try {
		evt = wh.verify(body, {
			"svix-id": id,
			"svix-timestamp": timestamp,
			"svix-signature": signature,
		}) as WebhookEvent;
	} catch (err) {
		logger.error(`Error verifying webhook ${id}`, { err });
		return new Response("A identificação do webhook é inválida.", {
			status: 400,
		});
	}

	switch (evt.type) {
		case "user.created":
		case "user.updated":
			const data = evt.data;
			const uid = data.id;
			const { username, email_addresses, first_name, last_name, banned, image_url } = data;

			if (evt.type === "user.created") {
				await database.user.create({
					data: {
						externalId: uid,
						firstName: first_name,
						lastName: last_name,
						email: email_addresses[0].email_address,
						username: username || crypto.randomUUID(),
						profileImageUrl: image_url,
						banned,
					},
				});
			} else {
				await database.user.update({
					where: {
						externalId: uid,
					},
					data: {
						externalId: uid,
						firstName: first_name,
						lastName: last_name,
						email: email_addresses[0].email_address,
						username: username || undefined,
						profileImageUrl: image_url,
						banned,
					},
				});
			}
			break;

		case "user.deleted":
			const clerkId = evt.data.id;
			await database.user.delete({
				where: {
					externalId: clerkId,
				},
			});
	}

	return new Response("OK", { status: 200 });
});

const handler = router.handler(handlerConfig);
export { handler as POST };
