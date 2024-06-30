import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLD } from "@/components/logic/jsonld";
import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";
import { name } from "@/lib/name";
import { getURL } from "@/lib/url";
import { api } from "@/server/trpc/server";
import { Spoiler } from "@mantine/core";

import { Book } from "./_components/book";
import { Comment } from "./_components/comment";
import { CreateComment } from "./_components/create-comment";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const book = await api.files.one({ id: params.id, comments: true }).catch(() => notFound());
	return {
		title: book.title,
		description: `Leia "${book.title}" no Shelf: ${book.description.slice(0, 200)}`,
		openGraph: {
			images: [
				{
					url: `${getURL()}/api/og/book?title=${book.title}`,
				},
			],
		},
	};
}

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
	const book = await api.files.one({ id: params.id, comments: true }).catch(() => notFound());

	return (
		<>
			<Layout>
				<>
					<AppHeader />
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
								{book.workIdentifier && (
									<h4 className="break-words">Identificador: {book.workIdentifier}</h4>
								)}
								<h4 className="break-words">
									Disciplina(s):{" "}
									{new Intl.ListFormat("pt-br", {
										style: "long",
										type: "conjunction",
									}).format(
										book.tags.filter(val => val.tag.type === "DISCIPLINE").map(val => val.tag.name),
									)}
								</h4>
								<h4 className="break-words">
									Tema(s):{" "}
									{new Intl.ListFormat("pt-br", {
										style: "long",
										type: "conjunction",
									}).format(
										book.tags.filter(val => val.tag.type === "TOPIC").map(val => val.tag.name),
									)}
								</h4>
							</div>
						</div>
						<div className="w-full home-break:hidden">
							<Link
								href={`/reader/${book.id}`}
								className="flex w-full items-center justify-center gap-3 rounded-2xl bg-main px-6 py-1 text-center leading-tight text-black duration-200 hover:brightness-90"
							>
								Iniciar leitura
							</Link>
						</div>
						<div className="flex flex-col gap-2">
							<h2 className="text-2xl font-bold text-zinc-200">Comentários</h2>
							<CreateComment bookId={book.id} />
							<ul className="flex w-full flex-col gap-2 pt-2">
								{book.comments.length ? (
									book.comments
										.filter(comment => !comment.parentId)
										.map(comment => (
											<Comment
												key={comment.id}
												{...{
													comment,
													responses: book.comments.filter(val => val.parentId === comment.id),
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

			<JsonLD
				content={{
					"@context": "https://schema.org",
					"@type": "Book",
					"bookFormat": "EBook",
					"isbn": book.workIdentifier || undefined,
					"numberOfPages": book.pages,
					"about": book.description,
					"author": book.authors.map(author => ({ "@type": "Person", "givenName": author })),
					"comment": book.comments.map(comment => ({
						"@type": "Comment",
						"text": comment.textContent,
						"author": name({
							first: comment.owner.firstName,
							last: comment.owner.lastName,
							username: comment.owner.username,
						}),
					})),
					"commentCount": book.comments.length,
				}}
			/>
		</>
	);
}
