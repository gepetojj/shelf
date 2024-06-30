import { $Enums, Prisma } from "@prisma/client";

export type ReportCreateDTO = {
	postId: string;
	externalId: string;
	motive: $Enums.Motive;
	description?: string;
};

export interface ReportService {
	findFirstByPostAndUser(postId: string, externalId: string): Promise<Prisma.ReportGetPayload<{}> | null>;
	create(input: ReportCreateDTO): Promise<Prisma.ReportGetPayload<{}>>;
}
