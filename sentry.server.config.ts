// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: "https://0fd8ff820b255dc13b5618eb49fac5d6@o4507500711968768.ingest.us.sentry.io/4507500714590208",

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,

	// Uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: process.env.NODE_ENV === 'development',

	environment: process.env.NODE_ENV,
	release: process.env.npm_package_version,
});
