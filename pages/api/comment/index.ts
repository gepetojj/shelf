import { z } from "zod";

import type { Comment } from "@/entities/Comment";
import { query, resolver } from "@/lib/query";
import { now } from "@/lib/time";
import { api, handlerConfig, protect } from "@/models/api";

const router = api().use(protect);

const getSchema = z.object({
	bookId: z.string().uuid(),
});

router.get(async (req, res) => {
	const { bookId } = getSchema.parse(req.query);
	const ref = await query<Comment>("comments").where("bookId", "==", bookId).get();
	const comments = resolver(ref.docs);
	return res.json({ message: "Sucesso.", comments });
});

const postSchema = z.object({
	bookId: z.string().uuid(),
	parentId: z.string().uuid().optional(),
	content: z.string().max(400),
});

router.post(async (req, res) => {
	const { bookId, parentId, content } = postSchema.parse(JSON.parse(req.body));
	const comment: Comment = {
		id: crypto.randomUUID(),
		bookId,
		parentId: parentId || "",
		content,
		creator: {
			id: req.user?.id || "",
			name: req.user?.name || "",
			iconUrl: req.user?.image || "",
		},
		createdAt: now(),
	};

	try {
		await query("comments").id(comment.id).create(comment);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Não foi possível criar o comentário." });
	}

	return res.status(201).json({ message: "Comentário criado com sucesso." });
});

export default router.handler(handlerConfig);
