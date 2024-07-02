import { Prisma } from "@prisma/client";

export interface EnduranceService {
	findByUserId(userId: string): Promise<Prisma.EnduranceGetPayload<{}> | null>;
	getStreak(sequence: Date[]): number;
}
