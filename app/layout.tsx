import clsx from "clsx/lite";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

import { ThemesProvider } from "@/components/logic/themes-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@ungap/with-resolvers";

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
				<TRPCReactProvider>
					<body className={clsx("min-h-screen bg-main-background text-white antialiased", nunito.className)}>
						<ThemesProvider>
							<Notifications position="top-right" />
							{children}
						</ThemesProvider>
					</body>
				</TRPCReactProvider>
			</html>
		</ClerkProvider>
	);
}
