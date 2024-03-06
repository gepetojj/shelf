import clsx from "clsx/lite";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Nunito_Sans } from "next/font/google";

import { SessionProvider } from "@/components/logic/SessionProvider";
import { auth } from "@/models/auth";

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
	const session = await getServerSession(auth);

	return (
		<html lang="pt-br">
			<body className={clsx("min-h-screen bg-main-background text-white antialiased", nunito.className)}>
				<SessionProvider session={session}>{children}</SessionProvider>
			</body>
		</html>
	);
}
