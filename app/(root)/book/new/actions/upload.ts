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

const inputs = z.object({
	disciplines: z.array(z.string().trim()).min(1).max(5),
	topics: z.array(z.string().trim()).min(1).max(10),
	file: z
		.custom<File>()
		.refine(file => file && file.size <= megaToBytes(50), {
			message: "O livro enviado é maior que o limite de 50MB.",
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

const database = new PrismaClient();
const storage = container.get<StorageRepository>(Registry.StorageRepository);
const logger = container.get<Logger>(Registry.Logger);

export const upload = async (
	form: Omit<z.infer<typeof inputs>, "file"> & { blobs: FormData },
	userId: string,
): Promise<Outputs> => {
	// @ts-expect-error O único jeito de fazer o pdfjs funcionar é importando o worker
	await import("pdfjs-dist/build/pdf.worker.min.mjs");

	try {
		const blobs = Object.fromEntries(form.blobs);
		const data = inputs.parse({ ...form, file: blobs.file });

		if (data.book.globalIdentifier) {
			const exists = await promiseHandler(
				database.post.findFirst({ where: { workIdentifier: data.book.globalIdentifier } }),
				{
					location: "upload_action:find_post",
					message: "Não foi possível verificar se o livro já foi enviado anteriormente.",
				},
			);
			if (exists) return { success: false, message: "Este livro já foi enviado anteriormente." };
		}

		const bookId = crypto.randomUUID();
		const filename = data.book.title.toLocaleLowerCase("en").replaceAll(" ", "-");

		const file = Buffer.from(await data.file.arrayBuffer());
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
				const uploader = await tx.user.findFirst({ where: { externalId: userId } });

				await tx.post.create({
					data: {
						id: bookId,
						workIdentifier: data.book.globalIdentifier || undefined,
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
								bytes: data.file.size,
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

		return { success: true, message: "Livro enviado com sucesso." };
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			return {
				success: false,
				message: err.errors[0].message || "Verifique os dados enviados e tente novamente.",
			};
		}
		logger.error("Failed to upload book", { userId, err });
		return { success: false, message: err?.message || "Não foi possível fazer upload do livro. Tente novamente." };
	}
};
