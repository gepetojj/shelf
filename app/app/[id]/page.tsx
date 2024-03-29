import Link from "next/link";
import { notFound } from "next/navigation";
import { MdFilePresent } from "react-icons/md";

import { Layout } from "@/components/ui/Layout";
import type { Book as IBook } from "@/entities/Book";
import type { Comment as IComment } from "@/entities/Comment";
import { query, resolver } from "@/lib/query";
import { Spoiler } from "@mantine/core";

import { Header } from "../_components/layout/Header";
import { Book } from "./_components/Book";
import { Comment } from "./_components/Comment";
import { CreateComment } from "./_components/CreateComment";

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
	const [booksRef, commentsRef] = await Promise.all([
		query<IBook>("books").id(params.id).get(),
		query<IComment>("comments").where("bookId", "==", params.id).get(),
	]);

	const book = booksRef.data();
	const comments = resolver(commentsRef.docs);
	if (!booksRef.exists || !book) return notFound();

	return (
		<Layout>
			<>
				<Header />
				<section className="flex h-full w-full flex-col gap-4 overflow-y-auto px-12 py-7">
					<div className="flex flex-col gap-4">
						<div className="flex w-full flex-col gap-1 break-words">
							<h1 className="break-words text-2xl font-bold">{book.title}</h1>
							<h2 className="break-words text-xl font-semibold text-neutral-200">{book.subtitle}</h2>
							<h3 className="mt-1 break-words text-lg font-medium text-neutral-300">
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(book.authors)}
							</h3>
						</div>
						<div>
							<Spoiler
								maxHeight={200}
								showLabel="Ler mais"
								hideLabel="Ler menos"
							>
								<p className="text-light text-justify text-neutral-300">{book.description}</p>
							</Spoiler>
						</div>
						<div className="text-light break-words text-sm text-neutral-300">
							<h4 className="break-words">ISBN: {book.isbn13 || book.isbn10}</h4>
							<h4 className="break-words">Semestre: {book.semester}º Semestre</h4>
							<h4 className="break-words">
								Disciplina(s):{" "}
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(book.disciplines)}
							</h4>
							<h4 className="break-words">
								Tema(s):{" "}
								{new Intl.ListFormat("pt-br", {
									style: "long",
									type: "conjunction",
								}).format(book.topics)}
							</h4>
						</div>
					</div>
					<div className="w-full home-break-mobile:hidden">
						<Link
							href={`/reader/${book.id}`}
							className="flex w-full items-center justify-center gap-3 rounded-2xl bg-main px-6 py-1 
                        	text-center leading-tight text-black duration-200 hover:brightness-90"
						>
							Iniciar leitura
						</Link>
					</div>
					<div className="flex flex-col gap-2">
						<h2 className="text-2xl font-bold text-zinc-200">Anexos</h2>
						<ul className="flex w-full gap-2">
							{book.files.map(file => (
								<li
									key={file.id}
									className="flex items-center gap-2 rounded-xl bg-main-foreground px-3 py-2"
								>
									<MdFilePresent className="text-xl" />
									<span className="break-words font-light">
										{book.title.toLocaleLowerCase("en").replaceAll(" ", "-")}.
										{file.fullname.split(".")[1]}
									</span>
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-2">
						<h2 className="text-2xl font-bold text-zinc-200">Comentários</h2>
						<CreateComment bookId={book.id} />
						<ul className="flex w-full flex-col gap-2 pt-2">
							{comments.length ? (
								comments
									.filter(comment => !comment.parentId)
									.map(comment => (
										<Comment
											key={comment.id}
											{...{
												comment,
												responses: comments.filter(val => val.parentId === comment.id),
											}}
										/>
									))
							) : (
								<li className="w-full text-center">
									<span>Não há comentários ainda.</span>
								</li>
							)}
						</ul>
					</div>
				</section>
			</>

			<Book {...{ book }} />
		</Layout>
	);
}
