"use client";

import { memo } from "react";

import { Button, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
	fontFamily: "Nunito Sans, sans-serif",
	fontFamilyMonospace: "Nunito Sans, sans-serif",
	fontSmoothing: true,
	colors: {
		main: [
			"#fffde1",
			"#fef8cd",
			"#faf19d",
			"#f8e96a",
			"#f6e23f",
			"#f4de23",
			"#f4dc0e",
			"#d9c300",
			"#c0ad00",
			"#a59500",
		],
	},
	defaultRadius: "md",
	primaryColor: "main",
	cursorType: "pointer",
	autoContrast: true,
	components: {
		Button: Button.extend({
			defaultProps: {
				color: "#F5E02F",
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
