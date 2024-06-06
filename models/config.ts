import { z } from "zod";

const publicSchema = z.object({
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
	NEXT_CLERK_AFTER_SIGN_UP_URL: z.string(),
	NEXT_CLERK_AFTER_SIGN_IN_URL: z.string(),
});

const schema = publicSchema.and(
	z.object({
		NODE_ENV: z.string(),
		GOOGLE_ID: z.string(),
		GOOGLE_SECRET: z.string(),
		CLERK_SECRET_KEY: z.string(),
		FIREBASE_ID: z.string(),
		FIREBASE_SECRET: z.string(),
		FIREBASE_EMAIL: z.string(),
	}),
);

export const config = schema.parse(process.env);
export const publicConfig = publicSchema.parse(process.env);
