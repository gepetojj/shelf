import { headers } from "next/headers";
import { Webhook } from "svix";
import { Logger } from "winston";
import { z } from "zod";

import { config } from "@/config";
import { User } from "@/core/domain/entities/user";
import { DatabaseRepository } from "@/core/domain/repositories/database.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { api, handlerConfig } from "@/models/api";
import { WebhookEvent } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const router = api();

const getHandlerHeaders = z.object({
	id: z.string(),
	timestamp: z.string(),
	signature: z.string(),
});

const database = container.get<DatabaseRepository>(Registry.DatabaseRepository);
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
		return new Response("Houve um erro desconhecido.", {
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
				const user = User.fromJSON({
					id: crypto.randomUUID(),
					externalId: uid,
					firstName: first_name,
					lastName: last_name,
					email: email_addresses[0].email_address,
					username: username || crypto.randomUUID(),
					profileImageUrl: image_url,
					banned,
				});
				await database.create("users", user.id, user.toJSON());
			} else {
				let user = await database.findOne("users", [{ key: "externalId", comparator: "==", value: uid }]);
				user = {
					...user,
					externalId: uid,
					firstName: first_name,
					lastName: last_name,
					email: email_addresses[0].email_address,
					username: username || user.username,
					profileImageUrl: image_url,
					banned,
				};
				await database.update("users", user.id, user);
			}
	}

	return new Response("OK", { status: 200 });
});

const handler = router.handler(handlerConfig);
export { handler as POST };
