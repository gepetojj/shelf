"use server";

import { z } from "zod";

import { megaToBytes } from "@/lib/bytes";
import { createBook } from "@/pages/api/post/createBook";
import { uploadFile } from "@/pages/api/post/uploadFile";

const inputs = z.object({
	isbn: z.string(),
	semester: z.coerce.number().min(1).max(10),
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
	}),
});

export type Inputs = z.infer<typeof inputs>;

type Outputs = {
	success: boolean;
	message: string;
};

export const upload = async (form: Omit<z.infer<typeof inputs>, "file"> & { blobs: FormData }): Promise<Outputs> => {
	try {
		const blobs = Object.fromEntries(form.blobs);
		console.log(blobs);
		const data = inputs.parse({ ...form, file: blobs.file });

		const book = createBook({ data });
		const { file, rollback } = await uploadFile({
			file: data.file,
			uploader: "asd",
			bookId: book.id,
		});

		// try {
		// 	await query("books")
		// 		.id(book.id)
		// 		.create({
		// 			...book,
		// 			files: [file],
		// 		});
		// } catch (err) {
		// 	console.error("Erro ao tentar criar o registro do livro.");
		// 	console.debug(err);
		// 	await rollback();
		// }

		return { success: true, message: "Livro enviado com sucesso." };
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			return {
				success: false,
				message: err.errors[0].message || "Verifique os dados enviados e tente novamente.",
			};
		}
		return { success: false, message: err?.message || "Não foi possível fazer upload do livro. Tente novamente." };
	}
};
