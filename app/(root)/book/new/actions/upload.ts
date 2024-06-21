"use server";

import { fileTypeFromBuffer } from "file-type";
import { Logger } from "winston";
import { z } from "zod";

import { Book } from "@/core/domain/entities/book";
import { FileReference } from "@/core/domain/entities/file-reference";
import { FileTag } from "@/core/domain/entities/file-tag";
import { DatabaseRepository } from "@/core/domain/repositories/database.repository";
import { StorageRepository } from "@/core/domain/repositories/storage.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { megaToBytes } from "@/lib/bytes";
import { now } from "@/lib/time";

const inputs = z.object({
	disciplines: z.array(z.string()),
	topics: z.array(z.string()),
	file: z
		.custom<File>()
		.refine(file => file && file.size <= megaToBytes(100), {
			message: "O livro enviado é maior que o limite de 100MB.",
		})
		.refine(file => file && file.type === "application/pdf", {
			message: "O arquivo enviado não é um PDF.",
		}),
	book: z.object({
		title: z.string(),
		subtitle: z.string().optional().nullable(),
		authors: z.array(z.string()),
		publishers: z.array(z.string()).optional().nullable(),
		description: z.string().optional().nullable(),
		pages: z.coerce.number(),
		globalIdentifier: z.string().optional().nullable(),
		thumbnailUrl: z.string().url().optional().nullable(),
		thumbnailAltUrl: z.string().url().optional().nullable(),
	}),
});

export type Inputs = z.infer<typeof inputs>;

type Outputs = {
	success: boolean;
	message: string;
};

const database = container.get<DatabaseRepository>(Registry.DatabaseRepository);
const storage = container.get<StorageRepository>(Registry.StorageRepository);
const logger = container.get<Logger>(Registry.Logger);

const processTags = async (disciplines: string[], topics: string[]) => {
	const createTags: Promise<any>[] = [];
	for (const discipline of disciplines) {
		const indexable = FileTag.nameToIndexable(discipline);
		const exists = await database
			.findOne("file_tags", [
				{ key: "type", comparator: "==", value: "discipline" },
				{ key: "indexableName", comparator: "==", value: indexable },
			])
			.catch(() => undefined);
		if (!exists) {
			const tag = FileTag.fromJSON({
				id: crypto.randomUUID(),
				type: "discipline",
				name: discipline,
				indexableName: indexable,
				searchableName: FileTag.nameToSearchable(discipline),
			});
			createTags.push(database.create("file_tags", tag.id, tag.toJSON()));
		}
	}
	for (const topic of topics) {
		const indexable = FileTag.nameToIndexable(topic);
		const exists = await database
			.findOne("file_tags", [
				{ key: "type", comparator: "==", value: "topic" },
				{ key: "indexableName", comparator: "==", value: indexable },
			])
			.catch(() => undefined);
		if (!exists) {
			const tag = FileTag.fromJSON({
				id: crypto.randomUUID(),
				type: "topic",
				name: topic,
				indexableName: indexable,
				searchableName: FileTag.nameToSearchable(topic),
			});
			createTags.push(database.create("file_tags", tag.id, tag.toJSON()));
		}
	}
	return createTags;
};

export const upload = async (
	form: Omit<z.infer<typeof inputs>, "file"> & { blobs: FormData },
	user: { id: string; name: string; avatarUrl: string },
): Promise<Outputs> => {
	try {
		const blobs = Object.fromEntries(form.blobs);
		const data = inputs.parse({ ...form, file: blobs.file });

		if (!data.book.globalIdentifier) {
			return { success: false, message: "O ISBN do livro é obrigatório." };
		}
		const exists = await database
			.findOne("books", [{ key: "isbn", comparator: "==", value: data.book.globalIdentifier }])
			.catch(() => undefined);
		if (exists) {
			return { success: false, message: "Este livro já foi enviado anteriormente." };
		}

		const bookId = crypto.randomUUID();
		const filename = data.book.title.toLocaleLowerCase("en").replaceAll(" ", "-");

		const file = Buffer.from(await data.file.arrayBuffer());
		const fileType = await fileTypeFromBuffer(file);
		const extension = fileType?.ext || "pdf";

		const tagsToCreate = await processTags(data.disciplines, data.topics);

		const reference = FileReference.fromJSON({
			id: crypto.randomUUID(),
			referenceId: bookId,
			filename,
			extension,
			path: `files/${bookId}/${filename}.${extension}`,
			mimetype: data.file.type,
			byteSize: data.file.size,
			uploadedById: user.id,
			uploadedAt: now(),
		});

		const searchableKeywords = [];
		searchableKeywords.push(...data.book.title.trim().toLowerCase().split(" "));
		searchableKeywords.push(...data.book.authors.map(author => author.trim().toLowerCase().split(" ")).flat(2));
		searchableKeywords.push(...data.disciplines.map(discip => discip.trim().toLowerCase().split(" ")).flat(2));
		searchableKeywords.push(...data.topics.map(topic => topic.trim().toLowerCase().split(" ")).flat(2));

		const book = Book.fromJSON({
			id: bookId,
			title: data.book.title,
			description: data.book.description || "",
			authors: data.book.authors,
			pages: data.book.pages,
			collections: [],
			disciplines: data.disciplines,
			topics: data.topics,
			searchableKeywords,
			defaultFile: reference.id,
			files: [reference.toJSON()],
			uploaderId: user.id,
			uploaderFallback: { name: user.name, avatarUrl: user.avatarUrl },
			uploadedAt: now(),
			subtitle: data.book.subtitle || "",
			publishers: data.book.publishers || [],
			isbn: data.book.globalIdentifier || "",
			thumbnail: {
				small: data.book.thumbnailUrl || "",
				large: data.book.thumbnailAltUrl || "",
			},
		});

		try {
			await storage.create(reference.path, file);
		} catch (err: any) {
			logger.error("Failed to create file in storage", { reference, err });
			return { success: false, message: err.message || "Houve um erro inesperado." };
		}

		try {
			await Promise.all(tagsToCreate);
			await database.create("books", book.id, book.toJSON());
		} catch (err: any) {
			logger.error("Failed to register file", { book, err });
			await storage.delete(reference.path);
			return { success: false, message: err.message || "Houve um erro inesperado." };
		}

		return { success: true, message: "Livro enviado com sucesso." };
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			return {
				success: false,
				message: err.errors[0].message || "Verifique os dados enviados e tente novamente.",
			};
		}
		logger.error("Failed to upload book", { user, err });
		return { success: false, message: err?.message || "Não foi possível fazer upload do livro. Tente novamente." };
	}
};
