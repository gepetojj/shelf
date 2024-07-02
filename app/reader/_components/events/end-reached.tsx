import Image from "next/image";
import { memo, useEffect, useState } from "react";
import Confetti from "react-confetti";

import logo from "@/public/logo.svg";
import { Modal } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export type EndReachedEventProps = {
	show: boolean;
	onClose: () => void;
	pagesRead: number;
	booksRead: number;
};

export const EndReachedEvent: React.FC<EndReachedEventProps> = memo(function EndReachedEvent({
	show,
	onClose,
	pagesRead,
	booksRead,
}) {
	const { height, width } = useViewportSize();
	const [confetti, setConfetti] = useState(false);

	useEffect(() => {
		if (!show) return;

		setConfetti(true);
		setTimeout(() => {
			setConfetti(false);
		}, 4000);
	}, [onClose, show]);

	return (
		<>
			{show && (
				<Confetti
					width={width}
					height={height}
					numberOfPieces={300}
					recycle={confetti}
				/>
			)}

			<Modal
				opened={show}
				onClose={onClose}
				centered
				overlayProps={{
					backgroundOpacity: 0.55,
					blur: 2,
				}}
				transitionProps={{ transition: "scale", duration: 200 }}
				size="xl"
			>
				<div className="flex h-fit w-full flex-col items-center justify-center gap-6 p-10 text-center">
					<div className="flex flex-col gap-1">
						<h1 className="text-2xl font-bold">Você finalizou mais uma leitura!</h1>
						<h2 className="text-main">Você está cada vez mais próximo(a) do seu objetivo</h2>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex flex-col rounded-lg border-2 border-main">
							<header className="w-full bg-main px-2 text-sm text-black">
								<span className="w-full text-center">Páginas lidas</span>
							</header>
							<div className="flex h-full w-full items-center justify-center px-2 py-1">
								<span className="text-lg font-semibold">{pagesRead}</span>
							</div>
						</div>

						<div className="flex flex-col rounded-lg border-2 border-main">
							<header className="w-full bg-main px-2 text-sm text-black">
								<span className="w-full text-center">Livros lidos</span>
							</header>
							<div className="flex h-full w-full items-center justify-center px-2 py-1">
								<span className="text-lg font-semibold">{booksRead}</span>
							</div>
						</div>
					</div>
					<Image
						src={logo}
						alt="Logo do Shelf"
					/>
				</div>
			</Modal>
		</>
	);
});
