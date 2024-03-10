"use client";

import clsx from "clsx/lite";
import TimeAgo from "javascript-time-ago";
import pt from "javascript-time-ago/locale/pt";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useState, useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { MdMoreHoriz, MdSearch, MdSettings } from "react-icons/md";

import { type BookApiItem, queryBooks } from "@/lib/booksApi";
import { seconds } from "@/lib/time";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useContext } from "./Context";

const Filters = dynamic(() => import("./Filters").then(mod => mod.Filters));

TimeAgo.addDefaultLocale(pt);
const timeAgo = new TimeAgo("pt");

export const Books: React.FC = memo(function Component() {
	const [drawerOpen, drawerActions] = useDisclosure(false);

	const { books, filteredBooks, setFilters } = useContext();
	const [query, setQuery] = useState("");

	const [apiBooks, setApiBooks] = useState<BookApiItem[]>([]);
	const [fetching, startFetching] = useTransition();

	const fetchBooksApi = useCallback(async () => {
		const response = await queryBooks(query);
		setApiBooks(response);
	}, [query]);

	const onSearch = useCallback(() => {
		setFilters({ query });
		startFetching(() => {
			fetchBooksApi();
		});
	}, [fetchBooksApi, query, setFilters]);

	return (
		<>
			<Drawer
				opened={drawerOpen}
				onClose={drawerActions.close}
				closeButtonProps={{ "aria-label": "Botão de fechar o painel de filtros" }}
				title="Filtros de pesquisa"
				style={{
					backgroundColor: "var(--tw-main-background)",
				}}
			>
				<Filters />
			</Drawer>

			<form
				className="flex w-full items-center justify-center gap-3"
				onSubmit={e => {
					e.preventDefault();
					onSearch();
				}}
			>
				<div className="flex w-full max-w-md">
					<input
						type="search"
						name="books"
						placeholder="Busque por título, autor, ISBN, tema:"
						autoComplete="none"
						className="w-full rounded-l-xl bg-neutral-800 p-2 px-3 outline-none placeholder:text-neutral-600"
						value={query}
						onChange={e => setQuery(e.target.value)}
					/>
					<button
						type="submit"
						className="flex items-center justify-center rounded-r-xl bg-main p-1 px-1.5 text-black duration-200 hover:brightness-90"
						onClick={onSearch}
					>
						<span className="sr-only">Botão para executar pesquisa.</span>
						<MdSearch className="text-xl" />
					</button>
				</div>
				<div className="inline home-break:hidden">
					<button
						type="button"
						onClick={drawerActions.toggle}
						className="rounded-md p-2 duration-200 hover:bg-neutral-800"
					>
						<MdSettings className="text-xl" />
					</button>
				</div>
			</form>

			<section className="h-full w-full gap-2 overflow-y-auto px-4 py-7 home-break-mobile:px-12">
				{apiBooks && apiBooks.length ? (
					<div
						className={clsx(
							"border-bottom w-full border-white/10 duration-100 animate-in slide-in-from-left-1",
							fetching && "animate-pulse brightness-50",
						)}
					>
						<span className="flex items-center gap-2 text-xs font-light text-neutral-200">
							<FaGoogle aria-hidden="true" />
							Resultados do Google
						</span>
						<ul className="flex w-full flex-col gap-2 py-2">
							{apiBooks.map(book => (
								<li
									key={book.id}
									className="flex w-full flex-col gap-2 rounded-xl bg-main-foreground p-4"
								>
									<div className="flex w-full gap-6 break-words">
										<div className="flex w-full flex-col text-sm text-neutral-100">
											<span className="break-words">Título: {book.volumeInfo.title}</span>
											<span className="break-words">
												Autores(as):{" "}
												{new Intl.ListFormat("pt-br", {
													style: "long",
													type: "conjunction",
												}).format(book.volumeInfo.authors.slice(0, 2))}
											</span>
										</div>
										<div className="flex w-full flex-col text-sm text-neutral-100">
											{book.volumeInfo.industryIdentifiers?.length ? (
												<span className="break-words">
													ISBN: {book.volumeInfo.industryIdentifiers?.at(0)?.identifier}
												</span>
											) : null}
											<span className="break-words">
												Páginas: {book.volumeInfo.pageCount || "Não informado"}
											</span>
										</div>
									</div>
									<div className="flex w-full items-center justify-end">
										<Link
											href={`/app/new${book.volumeInfo.industryIdentifiers ? `?isbn=${book.volumeInfo.industryIdentifiers[0].identifier}` : ""}`}
											className="flex w-fit items-center justify-center gap-3 rounded-2xl bg-main 
                                            px-5 py-1 text-black duration-200 hover:brightness-90"
										>
											Postar esse livro
										</Link>
									</div>
								</li>
							))}
						</ul>
					</div>
				) : null}

				<div className="w-full">
					<span className="text-xs font-light text-neutral-200">
						{books.length !== filteredBooks.length
							? `Você está vendo ${filteredBooks.length} livros de ${books.length}`
							: `${books.length} livro(s) encontrado(s)`}
					</span>
					<ul className="flex w-full flex-col gap-2 py-2">
						{filteredBooks.length > 0 ? (
							filteredBooks.map(book => (
								<li
									key={book.id}
									className="relative flex w-full flex-col gap-4 rounded-xl bg-main-foreground p-4 duration-100 animate-in fade-in-20 hover:brightness-90"
								>
									<div className="z-[1] h-full w-full">
										<header className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-2 font-light">
												<Image
													alt="Imagem do usuário, vinda da conta Google vinculada."
													src={
														book.uploader.iconUrl ||
														"https://randomuser.me/api/portraits/lego/1.jpg"
													}
													width={34}
													height={34}
													className="rounded-full"
												/>
												<span className="truncate pl-1">
													{book.uploader.name.split(" ").slice(0, 2).join(" ")}
												</span>
												<span className="text-sm text-neutral-400">·</span>
												<span className="truncate text-sm text-neutral-400">
													postou {timeAgo.format(new Date(seconds(book.uploadedAt) * 1000))}
												</span>
											</div>
											<button>
												<MdMoreHoriz
													className="text-2xl text-neutral-400"
													aria-hidden="true"
												/>
											</button>
										</header>
										<Link
											href={`/app/${book.id}`}
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
													<span>ISBN: {book.isbn13 || book.isbn10}</span>
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
							))
						) : (
							<li className="w-full text-center duration-100 animate-in fade-in-20">
								<span className="text-lg font-semibold">Os filtros não retornaram resultados.</span>
							</li>
						)}
					</ul>
				</div>
			</section>
		</>
	);
});
