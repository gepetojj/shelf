import { $Enums, Prisma } from "@prisma/client";

export type CreateNotificationDTO = {
	externalId: string;
	trigger: $Enums.NotificationTrigger;
	title: string;
	textContent: string;
};

export interface NotificationService {
	findByExternalId(externalId: string, unread?: boolean): Promise<Prisma.NotificationGetPayload<{}>[]>;
	create(data: CreateNotificationDTO): Promise<Prisma.NotificationGetPayload<{}>>;
}
