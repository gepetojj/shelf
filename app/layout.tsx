import clsx from "clsx/lite";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

import "./globals.css";

const nunito = Nunito_Sans({ subsets: ["latin"], weight: "variable" });

export const metadata: Metadata = {
	title: "Shelf: Organize suas leituras",
	description: "Organize suas leituras acadêmicas e leia diretamente do navegador.",
};

const theme = createTheme({
	fontFamily: "Nunito Sans, sans-serif",
	fontFamilyMonospace: "Nunito Sans, sans-serif",
	fontSmoothing: true,
	colors: {
		main: [
			"#fffde3",
			"#fffacd",
			"#fff59c",
			"#ffef66",
			"#ffea3b",
			"#ffe721",
			"#ffe611",
			"#e3cc00",
			"#c9b500",
			"#ad9c00",
		],
	},
	defaultRadius: "md",
	primaryColor: "main",
	cursorType: "pointer",
	autoContrast: true,
});

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="pt-br">
				<TRPCReactProvider>
					<body className={clsx("min-h-screen bg-main-background text-white antialiased", nunito.className)}>
						<MantineProvider
							defaultColorScheme="dark"
							theme={theme}
						>
							<Notifications position="top-right" />
							{children}
						</MantineProvider>
					</body>
				</TRPCReactProvider>
			</html>
		</ClerkProvider>
	);
}
