export const Registry = {
	Logger: Symbol.for("Logger"),
	DatabaseRepository: Symbol.for("DatabaseRepository"),
	StorageRepository: Symbol.for("StorageRepository"),
} as const;
