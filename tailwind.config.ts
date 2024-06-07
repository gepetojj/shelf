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
			animation: {
				"progress-in": "progress-in 2s ease-in 200ms",
			},
			keyframes: {
				"progress-in": {
					"0%": { width: "0" },
				},
			},
			screens: {
				"home-break": "1000px",
				"home-break-mobile": "600px",
				"home-break-book": "530px",
				"break-reader": "700px",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
