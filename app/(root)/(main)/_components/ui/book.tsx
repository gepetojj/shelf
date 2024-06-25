import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { Time } from "@/components/ui/time";
import { name } from "@/lib/name";
import { Prisma } from "@prisma/client";

import { BookSettings } from "./book-settings";

type BookComponentProps = {
	book: Prisma.PostGetPayload<{ include: { uploader: true; tags: { include: { tag: true } } } }>;
	index: number;
};

export const Book: React.FC<BookComponentProps> = memo(function Book({ book, index }) {
	return (
		<li className="relative flex w-full flex-col gap-4 rounded-xl bg-main-foreground p-4 duration-100 animate-in fade-in-20 hover:brightness-90">
			<div className="z-[1] h-full w-full">
				<header className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 font-light">
						<Image
							alt="Imagem do usuário."
							src={book.uploader.profileImageUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
							width={34}
							height={34}
							className="rounded-full"
							loading="lazy"
						/>
						<span className="truncate pl-1">
							{name({
								first: book.uploader.firstName,
								last: book.uploader.lastName,
								username: book.uploader.username,
							})}
						</span>
						<span className="text-sm text-neutral-400">·</span>
						<span className="truncate text-sm text-neutral-400">
							postou <Time milliseconds={book.createdAt.valueOf()} />
						</span>
					</div>
					<BookSettings book={book} />
				</header>
				<Link
					href={`/book/${book.id}`}
					className="flex items-center justify-between gap-10 pl-12"
				>
					<div className="flex flex-col gap-2 text-sm text-neutral-100">
						<div className="flex flex-col">
							<span>Título: {book.title}</span>
							<span>
								Autores(as):{" "}
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(book.authors)}
							</span>
							{book.workIdentifier && <span>Identificador: {book.workIdentifier}</span>}
						</div>
						<div className="flex flex-col">
							<span>
								Disciplina(s):{" "}
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(
									book.tags.filter(val => val.tag.type === "DISCIPLINE").map(val => val.tag.name),
								)}
							</span>
							<span>
								Tema(s):{" "}
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(book.tags.filter(val => val.tag.type === "TOPIC").map(val => val.tag.name))}
							</span>
						</div>
					</div>
					<div className="hidden bg-slate-800 home-break-book:inline">
						{book.smallThumbnail && (
							<Image
								alt={`Imagem da capa do livro '${book.title}'.`}
								src={book.smallThumbnail}
								width={100}
								height={136}
								className="max-h-[136px] max-w-[100px] rounded-sm object-cover"
								loading={index <= 4 ? "eager" : "lazy"}
							/>
						)}
					</div>
				</Link>
			</div>

			{book.largeThumbnail && (
				<div className="absolute inset-0 h-full w-full home-break-book:hidden">
					<Image
						alt={`Imagem da capa do livro '${book.title}'.`}
						src={book.largeThumbnail}
						width={120}
						height={163}
						className="h-full w-full rounded-xl object-cover opacity-10"
						loading={index <= 4 ? "eager" : "lazy"}
					/>
				</div>
			)}
		</li>
	);
});
