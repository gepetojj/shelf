"use client";

import clsx from "clsx/lite";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState, useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { MdUpload } from "react-icons/md";

import { type BookApiItem, queryBooks } from "@/lib/booksApi";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

interface Fields {
	isbn: string;
	semester: number;
	disciplines: string;
	topics: string;
}

export interface FormProps {
	isbn?: string;
}

export const Form: React.FC<FormProps> = memo(function Component({ isbn }) {
	const router = useRouter();
	const { register, handleSubmit, getValues, setValue } = useForm<Fields>({ defaultValues: { isbn } });

	const [book, setBook] = useState<BookApiItem | undefined>(undefined);
	const [options, setOptions] = useState<BookApiItem[]>([]);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [message, setMessage] = useState("");

	const [fetching, startFetching] = useTransition();
	const [uploading, setUploading] = useState(false);
	const [modalOpen, { open, close }] = useDisclosure(false);

	const fetchISBN = useCallback(async () => {
		setMessage("");
		setOptions([]);

		const fieldIsbn = getValues("isbn");
		if (!fieldIsbn) return;

		const response = await queryBooks(fieldIsbn);
		if (!response) return setMessage("O Google não está retornando resultados. Tente novamente mais tarde.");

		setOptions(response);
		response.length && open();

		const book = response.find(val => val.volumeInfo.industryIdentifiers?.find(id => id.identifier === isbn));
		if (!book) return setMessage("Nenhum resultado encontrado.");
		setBook(book);
	}, [getValues, isbn, open]);

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			if (!book) {
				return notifications.show({
					title: "Erro",
					message: "Selecione um livro antes de postar.",
					color: "red",
				});
			}
			if (!file) {
				return notifications.show({
					title: "Erro",
					message: "Selecione o arquivo do livro antes de postar.",
					color: "red",
				});
			}
			if (!fields.semester) {
				return notifications.show({
					title: "Erro",
					message: "Selecione o semestre antes de postar.",
					color: "red",
				});
			}

			setUploading(true);
			const disciplines = fields.disciplines.split(",").map(val => val.trim());
			const topics = fields.topics.split(",").map(val => val.trim());

			const body = new FormData();
			body.append("file", file);
			body.append("book", JSON.stringify(book));
			body.append("isbn", fields.isbn);
			body.append("disciplines", JSON.stringify(disciplines));
			body.append("topics", JSON.stringify(topics));
			body.append("semester", String(fields.semester));

			const res = await fetch("/api/post", {
				method: "POST",
				body,
			});
			const json = (await res.json()) as { message: string };
			setUploading(false);

			if (res.ok) {
				notifications.show({
					title: "Sucesso",
					message: "O livro foi postado.",
					color: "green",
				});
				return router.push("/app");
			}
			return notifications.show({
				title: "Erro",
				message: json.message || "Houve um erro ao tentar postar o livro.",
				color: "red",
			});
		},
		[book, file, router],
	);

	useEffect(() => {
		if (!isbn || typeof isbn !== "string") return;
		startFetching(() => {
			fetchISBN();
		});
	}, [fetchISBN, isbn]);

	return (
		<>
			<Modal
				opened={modalOpen}
				onClose={close}
				title="Selecione o livro"
				centered
			>
				<section className="flex h-full w-full flex-col divide-y divide-white/5">
					{book && (
						<div className="flex w-full flex-col gap-1">
							<span className="text-xs text-neutral-400">Já selecionado</span>
							<div className="flex w-full flex-col p-2 text-sm">
								<h2 className="truncate">{book.volumeInfo.title}</h2>
								<h3 className="truncate text-neutral-200">
									Autores(as):{" "}
									{new Intl.ListFormat("pt-br", {
										style: "long",
										type: "conjunction",
									}).format(book.volumeInfo.authors.slice(0, 2))}
								</h3>
								{book.volumeInfo.industryIdentifiers?.length ? (
									<h3 className="truncate text-neutral-200">
										ISBN: {book.volumeInfo.industryIdentifiers?.at(0)?.identifier}
									</h3>
								) : null}
							</div>
						</div>
					)}
					{options.length ? (
						options.map(option => (
							<button
								key={option.id}
								className="flex w-full flex-col rounded-md p-2 text-sm duration-200 hover:bg-main-foreground"
								onClick={() => {
									setBook(option);
									setMessage("");
									close();
								}}
							>
								<h2 className="truncate">{option.volumeInfo.title}</h2>
								<h3 className="truncate text-neutral-200">
									Autores(as):{" "}
									{new Intl.ListFormat("pt-br", {
										style: "long",
										type: "conjunction",
									}).format(option.volumeInfo.authors.slice(0, 2))}
								</h3>
								{option.volumeInfo.industryIdentifiers?.length ? (
									<h3 className="truncate text-neutral-200">
										ISBN: {option.volumeInfo.industryIdentifiers?.at(0)?.identifier}
									</h3>
								) : null}
							</button>
						))
					) : (
						<div className="w-full text-center">
							<span>Não há resultados.</span>
						</div>
					)}
				</section>
			</Modal>

			<form
				className="flex flex-col gap-2 px-12 py-7"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-2xl font-bold">Publicar um livro</h1>
				<h2>Insira as informações e faça upload do arquivo do livro.</h2>
				<section className="flex flex-col gap-2 break-words">
					{/* <TextInput
						id="isbn"
						placeholder="ISBN:"
						{...register("isbn", {
							required: true,
							onBlur: () => {
								if (!getValues("isbn")) return;
								startFetching(() => {
									fetchISBN();
								});
							},
						})}
					/> */}
					{fetching && (
						<span className="flex items-center gap-1 text-sm animate-in slide-in-from-top-2">
							<FaSpinner className="animate-spin" />
							Carregando...
						</span>
					)}
					{message && (
						<span className="flex items-center gap-1 text-sm animate-in slide-in-from-top-2">
							{message}
						</span>
					)}
					{book && (
						<span className="flex items-center gap-1 truncate text-sm animate-in slide-in-from-top-2">
							Livro selecionado: {book.volumeInfo.title}
						</span>
					)}
					{/* <Autocomplete
						id="semester"
						label="Semestre:"
						items={[
							{ id: 1, label: "1º Semestre" },
							{ id: 2, label: "2º Semestre" },
							{ id: 3, label: "3º Semestre" },
							{ id: 4, label: "4º Semestre" },
							{ id: 5, label: "5º Semestre" },
							{ id: 6, label: "6º Semestre" },
							{ id: 7, label: "7º Semestre" },
							{ id: 8, label: "8º Semestre" },
						]}
						onChange={selected => setValue("semester", selected.id as number)}
						initial={1}
					/>
					<TextInput
						id="disciplines"
						placeholder="Matérias:"
						{...register("disciplines", { required: true })}
					/>
					<TextInput
						id="topics"
						placeholder="Temas:"
						{...register("topics", { required: true })}
					/> */}
					<span className="break-words pt-1 text-sm font-light text-neutral-100">
						Separe as matérias e temas usando vírgulas. Ex.: Tema 1, Tema 2, Tema 3
					</span>

					<label
						role="button"
						htmlFor="file"
						className="flex w-full select-none items-center justify-center gap-2 rounded-lg bg-main-foreground px-3 py-1.5 outline-none duration-200 hover:brightness-90"
						aria-disabled={uploading}
					>
						<MdUpload className="text-xl" />
						Selecione o arquivo do livro
					</label>
					{file && (
						<span className="text-sm animate-in slide-in-from-top-2">Arquivo selecionado: {file.name}</span>
					)}
					<input
						id="file"
						type="file"
						accept="application/epub+zip"
						onChange={e => setFile(e.target.files?.length ? e.target.files[0] : undefined)}
						hidden
						aria-hidden="true"
						disabled={uploading}
					/>
				</section>
				<div className="flex w-full items-center justify-end">
					<button
						type="submit"
						className={clsx(
							"mt-2 flex w-fit items-center justify-center gap-3 rounded-2xl bg-main px-6 py-1 text-black duration-200 hover:brightness-90",
							uploading && "cursor-progress brightness-90",
						)}
						disabled={uploading}
					>
						{uploading && <FaSpinner className="animate-spin" />}
						Publicar
					</button>
				</div>
			</form>
		</>
	);
});
