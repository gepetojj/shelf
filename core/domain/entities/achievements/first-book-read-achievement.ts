import { $Enums, Prisma } from "@prisma/client";

import { Achievement } from "../achievement";

export class FirstBookReadAchievement implements Achievement {
	code: $Enums.AchievementCode = "FIRST_BOOK_READ";
	name = "Primeiro livro lido";
	description = "Leia ao menos 85% do primeiro livro para desbloquear essa conquista.";

	canActivate(
		book: Prisma.PostGetPayload<{}>,
		progress: Prisma.ProgressGetPayload<{}>,
		_progresses: Prisma.ProgressGetPayload<{}>[],
	): boolean {
		return progress.page >= Math.floor(book.pages * 0.85);
	}

	toJSON() {
		return { code: this.code, name: this.name, description: this.description };
	}
}
