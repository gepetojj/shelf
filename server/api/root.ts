import { achievementsRouter } from "@/server/api/routers/achievements";
import { annotationsRouter } from "@/server/api/routers/annotations";
import { commentsRouter } from "@/server/api/routers/comments";
import { enduranceRouter } from "@/server/api/routers/endurance";
import { filesRouter } from "@/server/api/routers/files";
import { progressRouter } from "@/server/api/routers/progress";
import { reportsRouter } from "@/server/api/routers/reports";
import { tagsRouter } from "@/server/api/routers/tags";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
	files: filesRouter,
	fileAnnotations: annotationsRouter,
	fileTags: tagsRouter,
	progress: progressRouter,
	comments: commentsRouter,
	reports: reportsRouter,
	endurance: enduranceRouter,
	achievements: achievementsRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
