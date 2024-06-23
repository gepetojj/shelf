import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = new PrismaClient();

export const fileTagsRouter = createTRPCRouter({
	one: publicProcedure.input(z.object({ id: z.string().uuid().optional() })).query(async ({ input }) => {
		const data = await database.tag.findUnique({ where: { id: input.id } });
		if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Tag não encontrada." });
		return data;
	}),

	list: publicProcedure.query(async () => {
		const tags = await database.tag.findMany();
		return tags;
	}),

	search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
		const data = await database.tag.findMany({ where: { name: { search: input.query } } });
		return data;
	}),
});
