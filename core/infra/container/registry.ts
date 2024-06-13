export const Registry = {
	Logger: Symbol.for("Logger"),
	DatabaseRepository: Symbol.for("DatabaseRepository"),
	StorageRepository: Symbol.for("StorageRepository"),
	Http: Symbol.for("Http"),

	GoogleBooksGateway: Symbol.for("GoogleBooksGateway"),
	ListRelevantUseCase: Symbol.for("ListRelevantUseCase"),
} as const;
