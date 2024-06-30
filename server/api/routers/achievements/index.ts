// import { Logger } from "winston";
import { ACHIEVEMENTS } from "@/core/domain/entities/achievement";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = container.get<PrismaClient>(Registry.Prisma);
// const logger = container.get<Logger>(Registry.Logger);

export const achievementsRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const user = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
			location: "achievements_router:list:find_user",
			message: "Não foi possível encontrar o usuário.",
		});
		if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

		const achieved = await promiseHandler(database.achievement.findMany({ where: { userId: user.id } }), {
			location: "achievements_router:list",
			message: "Não foi possível listar as conquistas.",
		});

		const achievedObjs = achieved.map(av => {
			const obj = ACHIEVEMENTS.find(avv => {
				return Object.keys(avv)[0] === av.code;
			})!;
			const achievement = Object.values(obj)[0];
			return achievement.toJSON();
		});

		const toAchieve = ACHIEVEMENTS.filter(
			av => !achieved.map(av => av.code).includes(Object.keys(av)[0] as any),
		).map(av => {
			const achievement = Object.values(av)[0];
			return achievement.toJSON();
		});

		return { achieved: achievedObjs, toAchieve };
	}),
});
