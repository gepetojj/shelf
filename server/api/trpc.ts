import { NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getURL } from "@/lib/url";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
	const req = new NextRequest(getURL(), { headers: opts.headers });
	const auth = getAuth(req);
	return {
		...opts,
		auth,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.auth.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Você não tem permissão para fazer isso." });
	}
	return next({
		ctx: {
			auth: ctx.auth,
		},
	});
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
