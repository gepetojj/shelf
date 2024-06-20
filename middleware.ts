import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/notifications/(.*)", "/shelf/(.*)", "/book/new"]);

export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) {
		// TODO: Add permissions verification
		auth().protect();
	}
});

export const config = {
	matcher: ["/", "/((?!_next|$).*)"],
};
