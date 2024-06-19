import { publicConfig } from "@/config/public";

export const getURL = (): string => {
	let url = publicConfig.NEXT_PUBLIC_WEBSERVER_URL || "https://shelfbooks.club";

	if (process.env.NODE_ENV !== "production") {
		url = "http://localhost:3000";
	}

	if (["preview"].includes(publicConfig.NEXT_PUBLIC_VERCEL_ENV || "")) {
		url = `https://${publicConfig.NEXT_PUBLIC_VERCEL_BRANCH_URL}`;
	}

	return url;
};
