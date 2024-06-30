// import { Logger } from "winston";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { promiseHandler } from "@/lib/promise-handler";
import { DAY } from "@/lib/time";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const database = container.get<PrismaClient>(Registry.Prisma);
// const logger = container.get<Logger>(Registry.Logger);

export const enduranceRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const user = await promiseHandler(database.user.findUnique({ where: { externalId: ctx.auth.userId } }), {
			location: "endurance_router:list:find_user",
			message: "Não foi possível encontrar o usuário.",
		});
		if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

		const data = await promiseHandler(database.endurance.findUnique({ where: { userId: user.id } }), {
			location: "endurance_router:list",
			message: "Não foi possível listar a sequência.",
		});
		if (!data || data.sequence.length <= 0) return { sequence: [], streak: 0 };

		const { sequence } = data;

		const today = new Date(new Date().toISOString().split("T")[0] + "T00:00:00Z");
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
