import type { NextApiRequest, NextApiResponse } from "next";
import { type Session, getServerSession } from "next-auth";
import { type NextHandler, createRouter } from "next-connect";

import { auth } from "@/models/auth";

export interface ApiRequest extends NextApiRequest {
	user?: Session["user"];
}

export type Middleware = (req: ApiRequest, res: NextApiResponse, next: NextHandler) => Promise<void>;

export const handlerConfig = {
	onError: (err: unknown, _req: ApiRequest, res: NextApiResponse) => {
		console.error(err);
		return res.status(500).json({ message: "Houve um erro desconhecido." });
	},
	onNoMatch: (req: ApiRequest, res: NextApiResponse) => {
		return res.status(404).json({ message: "Recurso não encontrado." });
	},
};

export const protect: Middleware = async (req, res, next) => {
	const session = await getServerSession(req, res, auth);
	if (!session || !session.user) return res.status(403).json({ message: "Faça login." });
	req.user = session.user;
	return next();
};

export const api = () => {
	const router = createRouter<ApiRequest, NextApiResponse>();
	return router;
};
