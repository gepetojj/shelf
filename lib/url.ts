export const getURL = (): string => {
	let url = process.env.NEXT_PUBLIC_WEBSERVER_URL || "https://shelfbooks.club";

	if (process.env.NODE_ENV !== "production") {
		url = "http://localhost:3000";
	}

	if (["preview"].includes(process.env.NEXT_PUBLIC_VERCEL_ENV || "")) {
		if (!process.env.NEXT_PUBLIC_WEBSERVER_URL) console.error("Preview environment missing custom URL!");
	}

	return url;
};
