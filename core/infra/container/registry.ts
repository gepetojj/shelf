export const Registry = {
	Logger: Symbol.for("Logger"),
	DatabaseRepository: Symbol.for("DatabaseRepository"),
	Prisma: Symbol.for("Prisma"),
	StorageRepository: Symbol.for("StorageRepository"),
	Http: Symbol.for("Http"),

	GoogleBooksGateway: Symbol.for("GoogleBooksGateway"),
	ListRelevantUseCase: Symbol.for("ListRelevantUseCase"),

	UserService: Symbol.for("UserService"),
} as const;
