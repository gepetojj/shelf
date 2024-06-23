import { Logger } from "winston";
import { z } from "zod";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = new PrismaClient();
const logger = container.get<Logger>(Registry.Logger);

export const fileTagsRouter = createTRPCRouter({
	one: publicProcedure.input(z.object({ id: z.string().uuid().optional() })).query(async ({ input }) => {
		try {
			const data = await database.tag.findUnique({ where: { id: input.id } });
			if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Tag não encontrada." });
			return data;
		} catch (err: any) {
			logger.error(`[file_tags_router:one] Failed to find tag: ${err.message}`, { input, err });
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível encontrar a tag." });
		}
	}),

	list: publicProcedure.input(z.object({ books: z.boolean().optional() }).optional()).query(async ({ input }) => {
		try {
			const tags = await database.tag.findMany({ include: { posts: input?.books } });
			return tags;
		} catch (err: any) {
			logger.error(`[file_tags_router:list] Failed to list tags: ${err.message}`, { err });
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível listar as tags." });
		}
	}),

	search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
		try {
			const data = await database.tag.findMany({ where: { name: { search: input.query } } });
			return data;
		} catch (err: any) {
			logger.error(`[file_tags_router:search] Failed to search tags: ${err.message}`, { input, err });
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível buscar as tags." });
		}
	}),
});
