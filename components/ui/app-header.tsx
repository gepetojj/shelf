import Image from "next/image";
import { memo } from "react";

import logo from "@/public/logo.svg";
import { Tooltip } from "@mantine/core";

export const AppHeader: React.FC = memo(function AppHeader({}) {
	return (
		<header className="flex w-full select-none items-center justify-center pb-6 pt-2">
			<Image
				src={logo}
				alt="Logo do Shelf. Descrição: Ícone amarelo formado por círculos e retângulos desenhando a letra 'S', ao lado esquerdo do texto escrito 'Shelf.'."
				className="max-w-[110px]"
			/>
			<div className="flex h-full justify-start pl-2">
				<Tooltip
					label="Este programa está em fase inicial de desenvolvimento."
					position="bottom"
				>
					<span className="relative top-0 h-fit cursor-pointer rounded-lg bg-main px-1 text-xs text-black">
						dev
					</span>
				</Tooltip>
			</div>
		</header>
	);
});
