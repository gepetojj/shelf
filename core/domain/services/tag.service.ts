import { Prisma } from "@prisma/client";

export interface TagService {
	findAll(include?: Prisma.TagInclude): Promise<Prisma.TagGetPayload<{ include: { posts: true } }>[]>;
	findById(id: string): Promise<Prisma.TagGetPayload<{}> | null>;
	search(query: string): Promise<Prisma.TagGetPayload<{}>[]>;
}
