"use client";

import { memo } from "react";

import { Button, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
	fontFamily: "Nunito Sans, sans-serif",
	fontFamilyMonospace: "Nunito Sans, sans-serif",
	fontSmoothing: true,
	colors: {
		main: [
			"#fff6e1",
			"#ffedcc",
			"#ffda9b",
			"#ffc564",
			"#ffb438",
			"#ffa91b",
			"#ffa309",
			"#e38e00",
			"#ca7d00",
			"#b06c00",
		],
	},
	defaultRadius: "md",
	primaryColor: "main",
	cursorType: "pointer",
	autoContrast: true,
	components: {
		Button: Button.extend({
			defaultProps: {
				color: "#ffcb74",
			},
		}),
	},
});

export const ThemesProvider: React.FC<React.PropsWithChildren> = memo(function ThemesProvider({ children }) {
	return (
		<MantineProvider
			defaultColorScheme="dark"
			theme={theme}
		>
			{children}
		</MantineProvider>
	);
});
