import { fileAnnotationsRouter } from "@/server/api/routers/file-annotations";
import { fileTagsRouter } from "@/server/api/routers/file-tags";
import { filesRouter } from "@/server/api/routers/files";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
	files: filesRouter,
	fileAnnotations: fileAnnotationsRouter,
	fileTags: fileTagsRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
