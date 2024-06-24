import { z } from "zod";

const schema = z.object({
	NODE_ENV: z.string(),
	DATABASE_URL: z.string(),
	CLERK_SECRET_KEY: z.string(),
	CLERK_USER_WEBHOOK_SECRET: z.string(),
	GA_TAG_ID: z.string(),
	FIREBASE_ID: z.string(),
	FIREBASE_SECRET: z.string(),
	FIREBASE_EMAIL: z.string(),
});

export const config = schema.parse(process.env);
