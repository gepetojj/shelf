import { z } from "zod";

import { DatabaseRepository } from "@/core/domain/repositories/database.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const filesRouter = createTRPCRouter({
	list: publicProcedure
		.input(
			z.object({
				offset: z.coerce.number().min(10).max(20).optional().default(10),
				cursor: z.coerce.number().min(1).max(9999).optional().default(1),
			}),
		)
		.query(async ({ input }) => {
			const database = container.get<DatabaseRepository>(Registry.DatabaseRepository);

			// TODO: List all files
			const books = await database.findMany("books", [
				{ offset: input.offset, page: input.cursor, orderBy: "uploadedAt", sort: "desc" },
			]);

			return { books };
		}),
});
