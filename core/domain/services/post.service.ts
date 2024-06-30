import { Prisma } from "@prisma/client";

export interface PostService {
	findById(id: string): Promise<Prisma.PostGetPayload<{ include: { uploader: true } }> | null>;
}
