import { Logger } from "winston";

import { CreateNotificationDTO, NotificationService } from "@/core/domain/services/notification.service";
import { UnknownError } from "@/errors/infra";
import { PrismaClient } from "@prisma/client";

export class NotificationServiceImpl implements NotificationService {
	constructor(
		private database: PrismaClient,
		private logger: Logger,
	) {}

	async findByExternalId(externalId: string, unread?: boolean) {
		try {
			const notifications = await this.database.notification.findMany({
				where: { user: { externalId }, read: unread ? false : undefined },
				orderBy: { createdAt: "desc" },
			});

			if (unread) return notifications;

			const unreadNotifications = notifications.filter(notification => !notification.read);
			if (unreadNotifications.length > 0) {
				await this.database.notification.updateMany({
					where: { id: { in: unreadNotifications.map(notification => notification.id) } },
					data: { read: true },
				});
			}

			return notifications;
		} catch (err: any) {
			this.logger.error(
				`[notification_service:find_by_external_id] Failed to find notifications: ${err.message || "No message"}`,
			);
			this.logger.debug("[notification_service:find_by_external_id] Error details:", {
				error: JSON.stringify(err),
				externalId,
				unread,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao buscar as notificações.",
				location: "notification_service:find_by_external_id",
				context: { err, externalId, unread },
			});
		}
	}

	async create(data: CreateNotificationDTO) {
		try {
			return await this.database.notification.create({
				data: {
					user: { connect: { externalId: data.externalId } },
					trigger: data.trigger,
					title: data.title,
					textContent: data.textContent,
				},
			});
		} catch (err: any) {
			this.logger.error(
				`[notification_service:create] Failed to create notification: ${err.message || "No message"}`,
			);
			this.logger.debug("[notification_service:create] Error details:", {
				error: JSON.stringify(err),
				data,
			});
			throw new UnknownError({
				message: err.message || "Houve um erro ao criar a notificação.",
				location: "notification_service:create",
				context: { err, data },
			});
		}
	}
}
