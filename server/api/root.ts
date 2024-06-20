import { fileAnnotationsRouter } from "@/server/api/routers/file-annotations";
import { filesRouter } from "@/server/api/routers/files";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
	files: filesRouter,
	fileAnnotations: fileAnnotationsRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
