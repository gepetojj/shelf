import { ACHIEVEMENTS } from "@/core/domain/entities/achievement";
import { AchievementService } from "@/core/domain/services/achievement.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const service = container.get<AchievementService>(Registry.AchievementService);

export const achievementsRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const achieved = await service.findByExternalId(ctx.auth.userId);

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
