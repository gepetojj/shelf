import { Logger } from "winston";
import { z } from "zod";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = new PrismaClient();
const logger = container.get<Logger>(Registry.Logger);

export const filesRouter = createTRPCRouter({
	one: publicProcedure
		.input(z.object({ id: z.string().uuid(), comments: z.boolean().optional(), files: z.boolean().optional() }))
		.query(async ({ input }) => {
			try {
				const data = await database.post.findUnique({
					where: { id: input.id },
					include: {
						comments: { include: { owner: input.comments } },
						uploader: true,
						tags: { include: { tag: true } },
						files: input.files,
					},
				});
				if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Postagem não encontrada." });
				return data;
			} catch (err: any) {
				logger.error(`[files_router:one] Failed to find post: ${err.message}`, { input, err });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Não foi possível encontrar a postagem.",
				});
			}
		}),

	list: publicProcedure
		.input(
			z.object({
				offset: z.coerce.number().min(10).max(20).optional().default(10),
				cursor: z.string().uuid().optional(),
				discipline: z.string().optional(),
				topic: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			try {
				const tags = [input.discipline, input.topic].filter(tag => !!tag) as string[];
				const data = await database.post.findMany({
					where: {
						tags: { some: { tag: { name: { contains: tags.length ? tags.join("|") : undefined } } } },
					},
					orderBy: { createdAt: "desc" },
					include: { uploader: true, tags: { include: { tag: true } } },
					take: input.offset,
					skip: input.cursor ? 1 : undefined, // Pula o cursor
					cursor: input.cursor ? { id: input.cursor } : undefined,
				});
				return data;
			} catch (err: any) {
				logger.error(`[files_router:list] Failed to list posts: ${err.message}`, { input, err });
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Não foi possível listar as postagens.",
				});
			}
		}),

	search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
		try {
			const data = await database.post.findMany({
				where: { title: { search: input.query } },
				include: { uploader: true, tags: { include: { tag: true } } },
			});
			return data;
		} catch (err: any) {
			logger.error(`[files_router:search] Failed to search posts: ${err.message}`, { input, err });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Não foi possível buscar as postagens.",
			});
		}
	}),
});
