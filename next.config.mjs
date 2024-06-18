import withBundleAnalyzer from "@next/bundle-analyzer";

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

export default withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
})(nextConfig);
