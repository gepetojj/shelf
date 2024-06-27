import { type NextRequest } from "next/server";
import { Logger } from "winston";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import * as Sentry from "@sentry/nextjs";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
	return createTRPCContext({
		headers: req.headers,
	});
};

const logger = container.get<Logger>(Registry.Logger);

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
		onError: ({ path, error }) => {
			if (process.env.NODE_ENV === "development") {
				logger.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
			}
			if (error.code === "FORBIDDEN" || error.code === "UNAUTHORIZED") return;
			Sentry.captureException(error, { tags: { path } });
		},
	});

export { handler as GET, handler as POST };
