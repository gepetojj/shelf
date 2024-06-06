import clsx from "clsx/lite";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

import "./globals.css";

const nunito = Nunito_Sans({ subsets: ["latin"], weight: "variable" });

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
		<ClerkProvider>
			<html lang="pt-br">
				<body className={clsx("min-h-screen bg-main-background text-white antialiased", nunito.className)}>
					<MantineProvider defaultColorScheme="dark">
						<Notifications position="top-right" />
						{children}
					</MantineProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

