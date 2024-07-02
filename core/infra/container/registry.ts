export const Registry = {
	Logger: Symbol.for("Logger"),
	Prisma: Symbol.for("Prisma"),
	StorageRepository: Symbol.for("StorageRepository"),
	Http: Symbol.for("Http"),

	GoogleBooksGateway: Symbol.for("GoogleBooksGateway"),
	ListRelevantUseCase: Symbol.for("ListRelevantUseCase"),

	UserService: Symbol.for("UserService"),
	AchievementService: Symbol.for("AchievementService"),
	CommentService: Symbol.for("CommentService"),
	EnduranceService: Symbol.for("EnduranceService"),
	AnnotationService: Symbol.for("AnnotationService"),
	TagService: Symbol.for("TagService"),
	ReportService: Symbol.for("ReportService"),
	PostService: Symbol.for("PostService"),
	NotificationService: Symbol.for("NotificationService"),
} as const;
