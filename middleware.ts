import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/notifications/(.*)", "/shelf/(.*)", "/book/new"]);

export default clerkMiddleware((auth, req) => {
	if (!auth().userId && isProtectedRoute(req)) {
		// TODO: Add permissions verification
		return auth().redirectToSignIn();
	}
});

export const config = {
	matcher: ["/", "/((?!api|_next|$).*)"],
};
