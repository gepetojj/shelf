"use client";

import { memo } from "react";

import { Button, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
	fontFamily: "Nunito Sans, sans-serif",
	fontFamilyMonospace: "Nunito Sans, sans-serif",
	fontSmoothing: true,
	colors: {
		main: [
			"#fffee0",
			"#fffacb",
			"#fef39a",
			"#fded64",
			"#fce838",
			"#fce41b",
			"#fce303",
			"#e0c900",
			"#c7b200",
			"#ab9900",
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
