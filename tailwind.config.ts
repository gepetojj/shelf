import type { Config } from "tailwindcss";

const config = {
	content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				main: {
					DEFAULT: "#F5E02F",
					background: "#141411",
					foreground: "#1C1C1A",
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
