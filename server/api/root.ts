import { commentsRouter } from "@/server/api/routers/comments";
import { enduranceRouter } from "@/server/api/routers/endurance";
import { fileAnnotationsRouter } from "@/server/api/routers/file-annotations";
import { fileTagsRouter } from "@/server/api/routers/file-tags";
import { filesRouter } from "@/server/api/routers/files";
import { progressRouter } from "@/server/api/routers/progress";
import { reportsRouter } from "@/server/api/routers/reports";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
	files: filesRouter,
	fileAnnotations: fileAnnotationsRouter,
	fileTags: fileTagsRouter,
	progress: progressRouter,
	comments: commentsRouter,
	reports: reportsRouter,
	endurance: enduranceRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
