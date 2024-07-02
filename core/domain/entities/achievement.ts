import { $Enums, Prisma } from "@prisma/client";

import { FirstBookReadAchievement } from "./achievements/first-book-read-achievement";

export interface Achievement {
	code: $Enums.AchievementCode;
	name: string;
	description: string;

	canActivate: (
		book: Prisma.PostGetPayload<{}>,
		progress: Prisma.ProgressGetPayload<{}>,
		progresses: Prisma.ProgressGetPayload<{}>[],
	) => boolean;
	toJSON: () => { code: $Enums.AchievementCode; name: string; description: string };
}

export const ACHIEVEMENTS: Record<$Enums.AchievementCode, Achievement>[] = [
	{ FIRST_BOOK_READ: new FirstBookReadAchievement() },
] as const;
