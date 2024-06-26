import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.googleusercontent.com",
			},
			{
				hostname: "books.google.com",
			},
			{
				protocol: "https",
				hostname: "randomuser.me",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
		],
	},
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks", "react-pdf", "@tabler/icons-react"],
	},
	webpack: config => {
		config.resolve.alias.canvas = false;
		return config;
	},
};

export default withSentryConfig(
	withBundleAnalyzer({
		enabled: process.env.ANALYZE === "true",
	})(nextConfig),
	{
		// For all available options, see:
		// https://github.com/getsentry/sentry-webpack-plugin#options

		org: "cosmix",
		project: "shelf",

		// Only print logs for uploading source maps in CI
		silent: !process.env.CI,

		// For all available options, see:
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

		// Upload a larger set of source maps for prettier stack traces (increases build time)
		widenClientFileUpload: true,

		// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
		// This can increase your server load as well as your hosting bill.
		// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
		// side errors will fail.
		tunnelRoute: "/monitoring",

		// Hides source maps from generated client bundles
		hideSourceMaps: true,

		// Automatically tree-shake Sentry logger statements to reduce bundle size
		disableLogger: true,

		// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
		// See the following for more information:
		// https://docs.sentry.io/product/crons/
		// https://vercel.com/docs/cron-jobs
		automaticVercelMonitors: true,
	},
);
