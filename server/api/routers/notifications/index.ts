import { NotificationService } from "@/core/domain/services/notification.service";
import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const service = container.get<NotificationService>(Registry.NotificationService);

export const notificationRouter = createTRPCRouter({
	unread: protectedProcedure.query(async ({ ctx }) => {
		const notifications = await service.findByExternalId(ctx.auth.userId, true);
		return notifications;
	}),

	list: protectedProcedure.query(async ({ ctx }) => {
		const notifications = await service.findByExternalId(ctx.auth.userId);
		return notifications;
	}),
});
