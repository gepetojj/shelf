import formidable from "formidable";
import { z } from "zod";

import { query } from "@/lib/query";
import { api, handlerConfig, protect } from "@/models/api";

import { createBook } from "./createBook";
import { uploadFile } from "./uploadFile";

export const config = {
	api: {
		bodyParser: false,
	},
};

export const schema = z.object({
	isbn: z.string().min(10).max(13),
	disciplines: z.array(z.string().trim()),
	topics: z.array(z.string().trim()),
	semester: z.coerce.number().min(1).max(10),
	book: z.object({
		id: z.string(),
		volumeInfo: z.object({
			title: z.string(),
			subtitle: z.string(),
			authors: z.array(z.string()),
			publisher: z.string(),
			description: z.string(),
			pageCount: z.coerce.number(),
			industryIdentifiers: z.array(
				z.object({
					type: z.string(),
					identifier: z.string(),
				}),
			),
			imageLinks: z
				.object({
					smallThumbnail: z.string().url(),
					thumbnail: z.string().url(),
				})
				.optional(),
		}),
	}),
});

export default api()
	.use(protect)
	.post(async (req, res) => {
		const form = formidable({
			maxFields: 6,
			maxFiles: 1,
			allowEmptyFiles: false,
			maxFileSize: 10 * 1024 * 1024, // 10 MB
			filter: part => !!part.mimetype && part.mimetype.includes("epub+zip"),
		});

		const [fields, files] = await form.parse(req);
		if (!files.file || !files.file[0]) {
			return res.status(400).json({ message: "Envie o arquivo no formato correto." });
		}

		const body = schema.parse({
			isbn: fields.isbn?.at(0),
			disciplines: JSON.parse(fields.disciplines?.at(0) || ""),
			topics: JSON.parse(fields.topics?.at(0) || ""),
			semester: fields.semester?.at(0),
			book: JSON.parse(fields.book?.at(0) || ""),
		});

		const book = createBook({ data: body, user: req.user });
		const { file, rollback } = await uploadFile({
			file: files.file[0],
			uploader: req.user?.id || "",
			bookId: book.id,
		});

		try {
			await query("books")
				.id(book.id)
				.create({
					...book,
					files: [file],
				});
		} catch (err) {
			console.error("Erro ao tentar criar o registro do livro.");
			console.debug(err);
			await rollback();
		}

		return res.status(201).json({ message: "Sucesso." });
	})
	.handler(handlerConfig);
