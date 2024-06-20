import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { BookProps } from "@/core/domain/entities/book";

export interface BookComponentProps {
	book: BookProps;
}

export const Book: React.FC<BookComponentProps> = memo(function Book({ book }) {
	return (
		<>
			<div className="sticky top-10 flex w-fit flex-col items-start gap-3 rounded-md bg-main-foreground p-3">
				<Image
					alt={`Imagem da capa do livro '${book.title}'`}
					src={book.thumbnail.large}
					width={200}
					height={180}
				/>
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
