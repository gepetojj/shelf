import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import logo from "@/public/logo.png";
import { Tooltip } from "@mantine/core";

export const AppHeader: React.FC = memo(function AppHeader({}) {
	return (
		<header className="flex w-full select-none items-center justify-center pb-6 pt-2">
			<Link href="/">
				<Image
					src={logo}
					alt="Logo do Shelf."
					aria-description="Ícone amarelo formado por círculos e retângulos desenhando a letra 'S', ao lado esquerdo do texto escrito 'Shelf'."
					className="max-w-[110px]"
					placeholder="blur"
					priority
				/>
			</Link>
			<div className="flex h-full justify-start pl-2">
				<Tooltip
					label="Este programa está em fase inicial de desenvolvimento."
					position="bottom"
				>
					<span className="relative top-0 h-fit cursor-pointer rounded-lg bg-main px-1 text-xs text-black">
						alfa
					</span>
				</Tooltip>
			</div>
		</header>
	);
});
