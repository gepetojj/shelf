import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo.png";

import { Settings } from "./_components/settings";
import { SettingsProvider } from "./_components/settings-context";

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SettingsProvider>
			<header
				id="reader-header"
				className="flex w-full items-center justify-between px-7 py-5"
			>
				<Link href="/">
					<Image
						src={logo}
						alt="Logo do Shelf."
						aria-description="Ícone amarelo formado por círculos e retângulos desenhando a letra 'S', ao lado esquerdo do texto escrito 'Shelf'."
						className="max-w-[100px] select-none"
						placeholder="blur"
						priority
					/>
				</Link>
				<Settings />
			</header>
			<main
				id="content"
				className="h-full w-full"
			>
				{children}
			</main>
		</SettingsProvider>
	);
}
