import { z } from "zod";

import { DatabaseRepository } from "@/core/domain/repositories/database.repository";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { now } from "@/lib/time";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const database = container.get<DatabaseRepository>(Registry.DatabaseRepository);

export const fileAnnotationsRouter = createTRPCRouter({
	one: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input, ctx }) => {
		const annotation = await database.findOne("file_annotations", [
			{ key: "id", comparator: "==", value: input.id },
			{ key: "userId", comparator: "==", value: ctx.auth.userId },
		]);
		return annotation;
	}),

	list: protectedProcedure.input(z.object({ fileId: z.string().uuid() })).query(async ({ input, ctx }) => {
		const annotations = await database.findMany("file_annotations", [
			{ key: "userId", comparator: "==", value: ctx.auth.userId },
			{ key: "fileId", comparator: "==", value: input.fileId },
		]);

		return annotations;
	}),

	highlight: protectedProcedure
		.input(
			z.object({
				fileId: z.string().uuid(),
				page: z.coerce.number().min(1).max(9999),
				text: z.string(),
				substrings: z.record(
					z.coerce.number().min(0),
					z.object({ start: z.number().min(0), end: z.number().min(0) }),
				),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const annotation = await database
				.findOne("file_annotations", [
					{ key: "userId", comparator: "==", value: ctx.auth.userId },
					{ key: "fileId", comparator: "==", value: input.fileId },
					{ key: "page", comparator: "==", value: input.page },
					{ key: "textContent", comparator: "==", value: input.text },
				])
				.catch(() => undefined);
			if (annotation) {
				throw new TRPCError({ code: "CONFLICT", message: "Uma anotação do mesmo trecho já existe." });
			}

			const id = crypto.randomUUID();
			await database.create("file_annotations", id, {
				userId: ctx.auth.userId,
				fileId: input.fileId,
				page: input.page,
				textContent: input.text.replaceAll("\n", " "),
				substrings: input.substrings,
				comment: null,
				createdAt: now(),
			});
		}),

	comment: protectedProcedure
		.input(
			z.object({
				fileId: z.string().uuid(),
				page: z.coerce.number().min(1).max(9999),
				text: z.string(),
				substrings: z.record(
					z.coerce.number().min(0),
					z.object({ start: z.number().min(0), end: z.number().min(0) }),
				),
				comment: z.string().trim().min(1).max(500),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const annotation = await database
				.findOne("file_annotations", [
					{ key: "userId", comparator: "==", value: ctx.auth.userId },
					{ key: "fileId", comparator: "==", value: input.fileId },
					{ key: "page", comparator: "==", value: input.page },
					{ key: "textContent", comparator: "==", value: input.text },
				])
				.catch(() => undefined);
			if (annotation) {
				throw new TRPCError({ code: "CONFLICT", message: "Uma anotação do mesmo trecho já existe." });
			}

			const id = crypto.randomUUID();
			await database.create("file_annotations", id, {
				userId: ctx.auth.userId,
				fileId: input.fileId,
				page: input.page,
				textContent: input.text.replaceAll("\n", " "),
				substrings: input.substrings,
				comment: input.comment,
				createdAt: now(),
			});
		}),

	delete: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ input, ctx }) => {
		const annotation = await database.findOne("file_annotations", [
			{ key: "id", comparator: "==", value: input.id },
			{ key: "userId", comparator: "==", value: ctx.auth.userId },
		]);
		await database.delete("file_annotations", annotation.id);
	}),
});
