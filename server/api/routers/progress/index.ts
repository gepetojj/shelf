import { Logger } from "winston";
import { z } from "zod";

import { ACHIEVEMENTS } from "@/core/domain/entities/achievement";
import { EnduranceService } from "@/core/domain/services/endurance.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { $Enums, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const enduranceService = container.get<EnduranceService>(Registry.EnduranceService);
const database = container.get<PrismaClient>(Registry.Prisma);
const logger = container.get<Logger>(Registry.Logger);

export const progressRouter = createTRPCRouter({
	one: protectedProcedure.input(z.object({ bookId: z.string().uuid() })).query(async ({ input, ctx }) => {
		const user = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
			location: "progress_router:one:find_user",
			message: "Não foi possível encontrar o usuário.",
		});
		if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
		const book = await promiseHandler(
			database.post.findUnique({ where: { id: input.bookId }, include: { files: true } }),
			{
				location: "progress_router:one:find_book",
				message: "Não foi possível encontrar o livro.",
			},
		);
		if (!book) throw new TRPCError({ code: "NOT_FOUND", message: "Livro não encontrado." });

		const data = await promiseHandler(
			database.progress.findUnique({
				where: {
					userId_bookId_fileId: { userId: user.id, bookId: input.bookId, fileId: book.files[0].id },
				},
			}),
			{ location: "progress_router:one:find_progress", message: "Não foi possível encontrar o progresso." },
		);
		if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Postagem não encontrada." });
		return data;
	}),

	list: protectedProcedure.query(async ({ input, ctx }) => {
		try {
			const data = await database.progress.findMany({
				where: { user: { externalId: ctx.auth.userId } },
				include: { book: true },
			});
			return data;
		} catch (err: any) {
			logger.error(`[progress_router:list] Failed to list progress: ${err.message}`, { input, err });
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Não foi possível listar o progresso salvo.",
			});
		}
	}),

	upsert: protectedProcedure
		.input(z.object({ bookId: z.string().uuid(), page: z.coerce.number().min(1).max(9999) }))
		.mutation(async ({ input, ctx }) => {
			const user = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
				location: "progress_router:upsert:find_user",
				message: "Não foi possível encontrar o usuário.",
			});
			if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
			const book = await promiseHandler(
				database.post.findUnique({ where: { id: input.bookId }, include: { files: true } }),
				{
					location: "progress_router:upsert:find_book",
					message: "Não foi possível encontrar o livro.",
				},
			);
			if (!book) throw new TRPCError({ code: "NOT_FOUND", message: "Livro não encontrado." });
			const progresses = await promiseHandler(database.progress.findMany({ where: { userId: user.id } }), {
				location: "progress_router:upsert:find_progresses",
				message: "Não foi possível encontrar o progresso.",
			});

			const data = await database.$transaction(async tx => {
				// Atualiza ou cria o endurance

				const endurance = await tx.endurance.findUnique({ where: { userId: user.id } });
				if (!endurance) {
					// Cria o primeiro registro do streak
					await tx.endurance.create({
						data: { userId: user.id, sequence: [new Date()] },
					});
				} else {
					// Adiciona no registro do streak se o dia atual ainda não estiver
					const isTodayIntoEndurance = endurance.sequence.some(date => {
						const today = new Date();
						return (
							date.getUTCDate() === today.getUTCDate() &&
							date.getUTCMonth() === today.getUTCMonth() &&
							date.getUTCFullYear() === today.getUTCFullYear()
						);
					});
					if (!isTodayIntoEndurance) {
						// Primeiro registro do streak adicionando o dia
						await tx.endurance.update({
							where: { userId: user.id },
							data: { sequence: { push: new Date() } },
						});

						// Envia notificação caso streak seja módulo de uma semana
						if ((enduranceService.getStreak(endurance.sequence) + 1) % 7 === 0) {
							await tx.notification.create({
								data: {
									user: { connect: { externalId: user.externalId } },
									trigger: "STREAK",
									title: "Já se passou uma semana!",
									textContent:
										"Você completou uma semana de leitura diária sem interrupções. Continue assim!",
								},
							});
						}
					}
				}

				// Atualiza ou cria o progresso

				const previousProgress = progresses.find(p => p.bookId === input.bookId);
				const isTheEnd = input.page >= Math.floor(book.pages * 0.9);

				const progress = await tx.progress.upsert({
					where: {
						userId_bookId_fileId: { userId: user.id, bookId: input.bookId, fileId: book.files[0].id },
					},
					create: {
						userId: user.id,
						bookId: input.bookId,
						fileId: book.files[0].id,
						page: input.page,
						reachedTheEnd: isTheEnd,
					},
					update: {
						page: input.page,
						reachedTheEnd: isTheEnd || undefined,
					},
				});

				// Cria os achievements

				const achievements = await tx.achievement.findMany({ where: { userId: user.id } });
				const availableAchievements = ACHIEVEMENTS.filter(
					av => !achievements.map(av => av.code).includes(Object.keys(av)[0] as any),
				);
				const achievementsToCreate = availableAchievements.filter(av => {
					const achievement = Object.values(av)[0];
					return achievement.canActivate(book, progress, progresses);
				});

				if (achievementsToCreate.length > 0) {
					await tx.achievement.createMany({
						data: achievementsToCreate
							.map(av => Object.keys(av)[0] as $Enums.AchievementCode)
							.map(code => ({ userId: user.id, code })),
					});
				}

				return {
					progress,
					achievements: achievementsToCreate.map(av => {
						const achievement = Object.values(av)[0];
						return achievement.toJSON();
					}),
					events: {
						firstTimeEndReached: !previousProgress?.reachedTheEnd && isTheEnd,
						firstTImeEndReachedBooksRead: progresses.filter(p => p.reachedTheEnd).length + 1,
					},
				};
			});

			return data;
		}),
});
