import { EnduranceService } from "@/core/domain/services/endurance.service";
import { UserService } from "@/core/domain/services/user.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
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
		const streak = enduranceService.getStreak(sequence);

		return { sequence, streak };
	}),
});
