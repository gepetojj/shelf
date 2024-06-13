import { z } from "zod";

import { DatabaseRepository } from "@/core/domain/repositories/database.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const database = container.get<DatabaseRepository>(Registry.DatabaseRepository);

export const filesRouter = createTRPCRouter({
	one: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
		const [book, comments] = await Promise.all([
			database.findOne("books", [{ key: "id", comparator: "==", value: input.id }]),
			database.findMany("file_comments", [{ key: "fileId", comparator: "==", value: input.id }]),
		]);

		return { book, comments };
	}),

	list: publicProcedure
		.input(
			z.object({
				offset: z.coerce.number().min(10).max(20).optional().default(10),
				cursor: z.coerce.number().min(1).max(9999).optional().default(1),
			}),
		)
		.query(async ({ input }) => {
			// TODO: List all files
			const books = await database.findMany("books", [
				{ offset: input.offset, page: input.cursor, orderBy: "uploadedAt", sort: "desc" },
			]);

			return { books };
		}),
});
