import clsx from "clsx/lite";
import { Nunito_Sans } from "next/font/google";
import Script from "next/script";

import { ThemesProvider } from "@/components/logic/themes-provider";
import { config } from "@/config";
import { TRPCReactProvider } from "@/server/trpc/react";
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
import { defaultMetadata } from "./metadata";

const nunito = Nunito_Sans({
	subsets: ["latin"],
	style: ["normal", "italic"],
	weight: "variable",
	display: "swap",
	variable: "--font-nunito-sans",
});

export const metadata = defaultMetadata;

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
					<Script
						src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8042613292083876"
						crossOrigin="anonymous"
					/>
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
