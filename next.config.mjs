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
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
	},
	webpack: config => {
		config.resolve.alias.canvas = false;
		return config;
	},
};

export default nextConfig;
