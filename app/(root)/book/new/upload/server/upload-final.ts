"use server";

import { fileTypeFromBuffer } from "file-type";
import * as pdfjs from "pdfjs-dist";
import { Logger } from "winston";
import { z } from "zod";

import { StorageRepository } from "@/core/domain/repositories/storage.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { megaToBytes } from "@/lib/bytes";
import { promiseHandler } from "@/lib/promise-handler";
import { Prisma, PrismaClient } from "@prisma/client";

import { assembleChunks } from "./assemble-chunks";

const inputs = z.object({
	disciplines: z.array(z.string().trim()).min(1).max(5),
	topics: z.array(z.string().trim()).min(1).max(10),
	book: z.object({
		title: z.string(),
		subtitle: z.string().optional().nullable(),
		authors: z.array(z.string()),
		publishers: z.array(z.string()).optional().nullable(),
		description: z.string().optional().nullable(),
		identifier: z.string().optional().nullable(),
		thumbnailUrl: z.string().url().optional().nullable(),
		thumbnailAltUrl: z.string().url().optional().nullable(),
	}),
	chunk: z
		.custom<Blob>()
		.refine(chunk => chunk && chunk.size <= megaToBytes(3), {
			message: "O chunk enviado é maior que o limite de 3MB.",
		})
		.refine(chunk => chunk && chunk.type === "application/octet-stream", {
			message: "O arquivo enviado não é um chunk.",
		}),
	checksum: z.string(),
	chunkIndex: z.coerce.number().min(0).max(999),
	totalChunks: z.coerce.number().min(1).max(999),
	uploadId: z.string().uuid(),
	userId: z.string().startsWith("user_"),
	startedAt: z.coerce.number(),
});

type Inputs = z.infer<typeof inputs>;

type Outputs = {
	success: boolean;
	message: string;
};

const database = container.get<PrismaClient>(Registry.Prisma);
const storage = container.get<StorageRepository>(Registry.StorageRepository);
const logger = container.get<Logger>(Registry.Logger);

export const uploadFinal = async (input: Omit<Inputs, "chunk">, form: FormData): Promise<Outputs> => {
	// @ts-expect-error O único jeito de fazer o pdfjs funcionar é importando o worker
	await import("pdfjs-dist/build/pdf.worker.min.mjs");

	let data: Inputs;
	try {
		data = inputs.parse({ ...input, chunk: form.get("chunk") });
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			return {
				success: false,
				message: err.errors[0].message || "Verifique os dados enviados e tente novamente.",
			};
		}
		logger.error("Failed to upload book", { err });
		return { success: false, message: err?.message || "Não foi possível fazer upload do livro. Tente novamente." };
	}

	if (data.book.identifier) {
		const exists = await promiseHandler(
			database.post.findFirst({ where: { workIdentifier: data.book.identifier } }),
			{
				location: "upload_action:find_post",
				message: "Não foi possível verificar se o livro já foi enviado anteriormente.",
			},
		);
		if (exists) return { success: false, message: "Este livro já foi enviado anteriormente." };
	}

	const bookId = crypto.randomUUID();
	const filename = data.book.title.toLocaleLowerCase("en").replaceAll(" ", "-");

	const file = await assembleChunks(data.chunk, data.totalChunks, `chunk_uploads/${data.startedAt}_${data.uploadId}`);
	const fileType = await fileTypeFromBuffer(file);

	const extension = fileType?.ext || "pdf";
	const path = `files/${bookId}/${filename}.${extension}`;

	let pages = 0;

	try {
		const fileIntArray = Uint8Array.from(file);
		const doc = await pdfjs.getDocument(fileIntArray).promise;
		pages = doc.numPages;

		const scanPages = pages >= 15 ? 15 : pages;
		const hasText: boolean[] = [];

		for (let index = 0; index < scanPages; index++) {
			const page = await doc.getPage(index + 1);
			const text = await page.getTextContent();
			hasText.push(text.items.length > 0);
		}

		if (hasText.every(val => !val)) {
			return {
				success: false,
				message: "O arquivo enviado não contém texto, converta o arquivo e tente novamente.",
			};
		}
	} catch (err) {
		logger.error("Failed to read file as a PDF", { path, fileType, extension, err });
		return { success: false, message: "Não foi possível verificar as páginas do arquivo." };
	}

	try {
		await storage.create(path, file);
	} catch (err: any) {
		logger.error("Failed to create file in storage", { path, fileType, extension, err });
		return { success: false, message: "Não foi possível fazer upload do arquivo." };
	}

	try {
		await database.$transaction(async tx => {
			const uploader = await tx.user.findFirst({ where: { externalId: data.userId } });

			await tx.post.create({
				data: {
					id: bookId,
					workIdentifier: data.book.identifier || undefined,
					title: data.book.title,
					subtitle: data.book.subtitle,
					description: data.book.description || "",
					authors: data.book.authors,
					publishers: data.book.publishers || [],
					pages,
					largeThumbnail: data.book.thumbnailAltUrl || "",
					smallThumbnail: data.book.thumbnailUrl || "",
					files: {
						create: {
							name: filename,
							extension,
							path,
							mimeType: fileType?.mime || "application/pdf",
							bytes: file.byteLength,
							uploaderId: uploader?.id,
						},
					},
					uploaderId: uploader?.id,
					tags: {
						create: [
							...data.disciplines.map(
								tag =>
									({
										tag: {
											connectOrCreate: {
												where: { name: tag },
												create: { name: tag, type: "DISCIPLINE" },
											},
										},
									}) as Prisma.TagsOnPostsCreateWithoutPostInput,
							),
							...data.topics.map(
								tag =>
									({
										tag: {
											connectOrCreate: {
												where: { name: tag },
												create: { name: tag, type: "TOPIC" },
											},
										},
									}) as Prisma.TagsOnPostsCreateWithoutPostInput,
							),
						],
					},
				},
			});
		});
	} catch (err: any) {
		logger.error("Failed to register file", { err });
		await storage.delete(path);
		return { success: false, message: "Não foi possível registrar o livro." };
	}

	try {
		await storage.deleteFolder(`chunk_uploads/${data.startedAt}_${data.uploadId}`);
	} catch (err: any) {
		logger.error("Failed to delete chunk folder", { err });
	}

	return { success: true, message: "Livro enviado com sucesso." };
};
