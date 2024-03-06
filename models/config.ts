import { z } from "zod";

const schema = z.object({
	NODE_ENV: z.string(),
	GOOGLE_ID: z.string(),
	GOOGLE_SECRET: z.string(),
	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.string(),
	FIREBASE_ID: z.string(),
	FIREBASE_SECRET: z.string(),
	FIREBASE_EMAIL: z.string(),
});

export const config = schema.parse(process.env);
