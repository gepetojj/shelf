import { z } from "zod";

import { FileTag } from "@/core/domain/entities/file-tag";
import { DatabaseRepository } from "@/core/domain/repositories/database.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const database = container.get<DatabaseRepository>(Registry.DatabaseRepository);

export const fileTagsRouter = createTRPCRouter({
	one: publicProcedure
		.input(z.object({ id: z.string().uuid().optional(), name: z.string().optional() }))
		.query(async ({ input }) => {
			const tag = await database.findOne("file_tags", [
				{
					key: "id",
					comparator: "==",
					value: input.id,
					ignore: !input.id,
				},
				{
					key: "indexableName",
					comparator: "==",
					value: FileTag.nameToIndexable(input.name || ""),
					ignore: !input.name || !!input.id,
				},
			]);
			return tag;
		}),

	list: publicProcedure.query(async () => {
		const tags = await database.findMany("file_tags");
		return tags;
	}),

	search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
		const tags = await database.findMany("file_tags", [
			{
				key: "searchableName",
				comparator: "array-contains-any",
				value: input.query.toLowerCase().split(" ").slice(0, 20),
			},
		]);
		return tags;
	}),
});
