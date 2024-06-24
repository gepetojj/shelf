import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { AspectRatio } from "@mantine/core";
import { Prisma } from "@prisma/client";

export interface BookComponentProps {
	book: Prisma.PostGetPayload<{ include: { uploader: true; tags: { include: { tag: true } } } }>;
}

export const Book: React.FC<BookComponentProps> = memo(function Book({ book }) {
	return (
		<>
			<div className="sticky top-10 flex w-fit flex-col items-start gap-3 rounded-md bg-main-foreground p-3">
				<AspectRatio
					ratio={100 / 136}
					className="h-full w-full"
				>
					{book.largeThumbnail ? (
						<Image
							alt={`Imagem da capa do livro '${book.title}'`}
							src={book.largeThumbnail}
							width={200}
							height={180}
							className="max-w-[12rem]"
						/>
					) : (
						<div className="h-full w-full max-w-[12rem] bg-gradient-to-br from-slate-700 to-slate-900" />
					)}
				</AspectRatio>
				<div className="flex w-full flex-col truncate text-sm text-neutral-100">
					<span className="truncate">Páginas: {book.pages}</span>
					<span className="truncate">
						{new Intl.ListFormat("pt-br", {
							style: "long",
							type: "conjunction",
						}).format(book.publishers)}
					</span>
				</div>
				<div className="w-full">
					<Link
						href={`/reader/${book.id}`}
						className="flex w-full items-center justify-center gap-3 rounded-2xl bg-main px-6 py-1 text-center leading-tight text-black duration-200 hover:brightness-90"
					>
						Iniciar leitura
					</Link>
				</div>
			</div>
		</>
	);
});
