import { Prisma } from "@prisma/client";

export type AnnotationId = {
	ownerId: string;
	postId: string;
	page: number;
	textContent: string;
};

export type AnnotationUpsertDTO = {
	substrings: Record<
		number,
		{
			start: number;
			end: number;
		}
	>;
	comment?: string;

	onCreate: AnnotationId;
};

export interface AnnotationService {
	findById(id: AnnotationId): Promise<Prisma.AnnotationGetPayload<{}> | null>;
	findByPostAndOwner(postId: string, ownerId: string): Promise<Prisma.AnnotationGetPayload<{}>[]>;
	upsert(data: AnnotationUpsertDTO): Promise<Prisma.AnnotationGetPayload<{}>>;
	delete(id: AnnotationId): Promise<void>;
}
