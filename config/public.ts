import { z } from "zod";

const publicSchema = z.object({
	NEXT_PUBLIC_WEBSERVER_URL: z.string().optional(),
	NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
	NEXT_PUBLIC_VERCEL_BRANCH_URL: z.string().optional(),
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
	NEXT_CLERK_AFTER_SIGN_UP_URL: z.string(),
	NEXT_CLERK_AFTER_SIGN_IN_URL: z.string(),
});

export const publicConfig = publicSchema.parse(process.env);
