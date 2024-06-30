import { Prisma } from "@prisma/client";

export interface AchievementService {
	findByExternalId(externalId: string): Promise<Prisma.AchievementGetPayload<{}>[]>;
}
