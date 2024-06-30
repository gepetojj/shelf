import { Prisma } from "@prisma/client";

export interface UserService {
	findByExternalId(externalId: string): Promise<Prisma.UserGetPayload<{}> | null>;
}
