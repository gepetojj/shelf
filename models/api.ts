import { type NextHandler, createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { Logger } from "winston";
import { ZodError } from "zod";

import { container } from "@/core/infra/container";
import { Registry } from "@/core/infra/container/registry";
import { UnknownError } from "@/errors/infra";
import * as Sentry from "@sentry/nextjs";

export type Middleware = (req: NextRequest, ctx: RequestContext, next: NextHandler) => Promise<void>;

const logger = container.get<Logger>(Registry.Logger);

export const handlerConfig = {
	onError: (err: any, req: NextRequest, _ctx: RequestContext) => {
		if (err instanceof ZodError) {
			return NextResponse.json(
				{
					message: "Houve um erro de validação dos dados enviados.",
					issues: err.issues,
				},
				{ status: 400 },
			);
		}

		logger.error(`❌ API failed: ${err.message || "Unknown error"}`, { err });
		Sentry.captureException(err, { tags: { path: req.url } });

		if (err instanceof UnknownError) {
			return NextResponse.json({ message: err.message, location: err.location }, { status: 500 });
		}
		return NextResponse.json({ message: "Houve um erro desconhecido." }, { status: 500 });
	},
	onNoMatch: (_req: NextRequest, _ctx: RequestContext) => {
		return NextResponse.json({ message: "Recurso não encontrado." }, { status: 404 });
	},
};

export const api = () => {
	const router = createEdgeRouter<NextRequest, RequestContext>();
	return router;
};
