import { z } from "zod";

import type { Progress } from "@/entities/Progress";
import { query } from "@/lib/query";
import { api, handlerConfig, protect } from "@/models/api";

const schema = z.object({
	bookId: z.string().uuid(),
	progress: z.string().endsWith("%"),
	location: z.string().startsWith("epubcfi"),
});

export default api()
	.use(protect)
	.post(async (req, res) => {
		const { bookId, progress, location } = schema.parse(JSON.parse(req.body));

		const info: Progress = {
			id: req.user?.id || "",
			books: {},
		};
		info.books[bookId] = { progress, location };

		const ref = query<Progress>("progress").id(info.id);
		const doc = await ref.get();
		const data = doc.data();

		if (!doc.exists || !data) await ref.create(info);
		else await ref.update({ ...data, books: { ...data.books, ...info.books } });

		return res.status(200).json({ message: "Sucesso" });
	})
	.handler(handlerConfig);
