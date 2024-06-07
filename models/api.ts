import type { NextApiRequest, NextApiResponse } from "next";
import { type NextHandler, createRouter } from "next-connect";
import { ZodError } from "zod";

export type Middleware = (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => Promise<void>;

export const handlerConfig = {
	onError: (err: unknown, _req: NextApiRequest, res: NextApiResponse) => {
		console.error(err);

		if (err instanceof ZodError) {
			return res.status(400).json({
				message: "Houve um erro de validação.",
				error: {
					message: err.message,
					issues: err.issues,
				},
			});
		}

		return res.status(500).json({ message: "Houve um erro desconhecido." });
	},
	onNoMatch: (_req: NextApiRequest, res: NextApiResponse) => {
		return res.status(404).json({ message: "Recurso não encontrado." });
	},
};

export const api = () => {
	const router = createRouter<NextApiRequest, NextApiResponse>();
	return router;
};
