import { z } from "zod";

const publicSchema = z.object({
	NEXT_PUBLIC_WEBSERVER_URL: z.string().optional(),
	NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
	NEXT_PUBLIC_VERCEL_BRANCH_URL: z.string().optional(),
});

export const publicConfig = publicSchema.parse(process.env);
