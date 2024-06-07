import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
	newBook: publicProcedure
		.input(
			z.object({
				isbn: z.string(),
				semester: z.coerce.number().min(1).max(10),
				disciplines: z.array(z.string()),
				topics: z.array(z.string()),
				file: z
					.custom<File>()
					.refine(file => !file || file.size > 100 * 10 ** 6, {
						message: "O livro enviado é maior que o limite de 100MB.",
					})
					.refine(file => !file || !file.type.startsWith("application/pdf"), {
						message: "O arquivo enviado não é um PDF.",
					}),
				book: z.object({ id: z.string() }),
			}),
		)
		.mutation(({ input }) => {
			console.log(input);
		}),
});
