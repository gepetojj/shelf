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
					DEFAULT: "#ffcb74",
					background: "#111111",
					foreground: "#2f2f2f",
					contrast: "#f6f6f6",
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
			fontFamily: {
				"nunito-sans": ["var(--font-nunito-sans)"],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
