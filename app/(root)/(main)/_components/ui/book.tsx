import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { Time } from "@/components/ui/time";
import { BookProps } from "@/core/domain/entities/book";
import { IconDots } from "@tabler/icons-react";

type BookComponentProps = {
	book: BookProps;
};

export const Book: React.FC<BookComponentProps> = memo(function Book({ book }) {
	return (
		<li className="relative flex w-full flex-col gap-4 rounded-xl bg-main-foreground p-4 duration-100 animate-in fade-in-20 hover:brightness-90">
			<div className="z-[1] h-full w-full">
				<header className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 font-light">
						<Image
							alt="Imagem do usuário, vinda da conta Google vinculada."
							src={"https://randomuser.me/api/portraits/lego/1.jpg"}
							width={34}
							height={34}
							className="rounded-full"
						/>
						<span className="truncate pl-1">
							{
								// book.uploader.name.split(" ").slice(0, 2).join(" ")
								"Uploader"
							}
						</span>
						<span className="text-sm text-neutral-400">·</span>
						<span className="truncate text-sm text-neutral-400">
							postou <Time milliseconds={book.uploadedAt} />
						</span>
					</div>
					<button
						type="button"
						title="Configurações do post"
					>
						<IconDots
							className="text-2xl text-neutral-400"
							aria-hidden="true"
						/>
					</button>
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
							<span>ISBN: {book.isbn}</span>
						</div>
						<div className="flex flex-col">
							<span>Semestre: {book.semester}º Semestre</span>
							<span>
								Disciplina(s):{" "}
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(book.disciplines)}
							</span>
							<span>
								Tema(s):{" "}
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(book.topics)}
							</span>
						</div>
					</div>
					<div className="hidden bg-slate-800 home-break-book:inline">
						{book.thumbnail.small && (
							<Image
								alt={`Imagem da capa do livro '${book.title}'.`}
								src={book.thumbnail.small}
								width={100}
								height={136}
								className="max-h-[136px] max-w-[100px] rounded-sm object-cover"
							/>
						)}
					</div>
				</Link>
			</div>

			{book.thumbnail.large && (
				<div className="absolute inset-0 h-full w-full home-break-book:hidden">
					<Image
						alt={`Imagem da capa do livro '${book.title}'.`}
						src={book.thumbnail.large}
						width={120}
						height={163}
						className="h-full w-full rounded-xl object-cover opacity-10"
					/>
				</div>
			)}
		</li>
	);
});
