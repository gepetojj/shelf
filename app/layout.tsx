import clsx from "clsx/lite";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

import { ThemesProvider } from "@/components/logic/themes-provider";
import { config } from "@/config";
import { TRPCReactProvider } from "@/trpc/react";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@ungap/with-resolvers";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const nunito = Nunito_Sans({
	subsets: ["latin"],
	style: ["normal", "italic"],
	weight: "variable",
	display: "swap",
	variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
	title: "Shelf: Organize suas leituras",
	description: "Organize suas leituras acadêmicas e leia diretamente do navegador.",
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider localization={ptBR}>
			<html lang="pt-br">
				<head>
					<ColorSchemeScript />
				</head>
				<TRPCReactProvider>
					<body className={clsx("min-h-screen bg-main-background text-white antialiased", nunito.className)}>
						<ThemesProvider>
							<Notifications position="top-right" />
							{children}
							<Analytics />
							<GoogleAnalytics gaId={config.GA_TAG_ID} />
						</ThemesProvider>
					</body>
				</TRPCReactProvider>
			</html>
		</ClerkProvider>
	);
}
