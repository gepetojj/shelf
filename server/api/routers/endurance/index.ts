import { EnduranceService } from "@/core/domain/services/endurance.service";
import { UserService } from "@/core/domain/services/user.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { DAY, removeTime } from "@/lib/time";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const userService = container.get<UserService>(Registry.UserService);
const enduranceService = container.get<EnduranceService>(Registry.EnduranceService);

export const enduranceRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const user = await userService.findByExternalId(ctx.auth.userId);
		if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

		const data = await enduranceService.findByUserId(user.id);
		if (!data || data.sequence.length <= 0) return { sequence: [], streak: 0 };
		const { sequence } = data;

		const today = removeTime(new Date());
		let lastDate: Date | undefined = undefined;
		let streak = 0;

		for (let index = sequence.length - 1; index >= 0; index--) {
			const element = sequence[index];
			if (!lastDate) {
				const diff = Math.abs(today.getTime() - element.getTime());
				if (diff > DAY) break;
				lastDate = element;
				streak++;
				continue;
			}

			const diff = Math.abs(lastDate.getTime() - element.getTime());
			if (diff <= DAY) {
				streak++;
				lastDate = element;
			} else {
				break;
			}
		}

		return { sequence, streak };
	}),
});
