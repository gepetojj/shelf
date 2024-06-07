"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState, useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { LuFileCheck2 } from "react-icons/lu";
import { MdFileUploadOff, MdUpload } from "react-icons/md";

import { type BookApiItem, queryBooks } from "@/lib/booksApi";
import { Button, Group, Modal, Select, TagsInput, TextInput } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { upload } from "../actions/upload";

interface Fields {
	isbn: string;
	semester: number;
	disciplines: string[];
	topics: string[];
}

export interface FormProps {
	isbn?: string;
}

export const Form: React.FC<FormProps> = memo(function Component({ isbn }) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<Fields>({ defaultValues: { isbn, semester: 1 } });

	const [book, setBook] = useState<BookApiItem | undefined>(undefined);
	const [options, setOptions] = useState<BookApiItem[]>([]);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [message, setMessage] = useState("");

	const [semester, setSemester] = useState("1");
	const [disciplines, setDisciplines] = useState<string[]>([]);
	const [topics, setTopics] = useState<string[]>([]);

	const [fetching, startFetching] = useTransition();
	const [modalOpen, { open, close }] = useDisclosure(false);

	const fetchISBN = useCallback(async () => {
		setMessage("");
		setOptions([]);

		const fieldIsbn = getValues("isbn");
		if (!fieldIsbn || fieldIsbn.length < 10 || fieldIsbn.length > 13) return;

		const response = await queryBooks(fieldIsbn);
		if (!response) return setMessage("O Google não está retornando resultados. Tente novamente mais tarde.");

		setOptions(response);
		response.length > 1 && open();

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
			if (!fields.disciplines.length) {
				return notifications.show({
					title: "Erro",
					message: "Insira ao menos uma matéria antes de postar.",
					color: "red",
				});
			}
			if (!fields.topics.length) {
				return notifications.show({
					title: "Erro",
					message: "Insira ao menos um tópico antes de postar.",
					color: "red",
				});
			}

			const body = new FormData();
			body.append("file", file);

			const result = await upload({
				blobs: body,
				book,
				isbn: fields.isbn,
				disciplines: fields.disciplines,
				topics: fields.topics,
				semester: fields.semester,
			});

			if (result.success) {
				notifications.show({
					title: "Sucesso",
					message: "O livro foi postado.",
					color: "green",
				});
				return router.push("/");
			}
			return notifications.show({
				title: "Erro",
				message: result.message,
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
					<TextInput
						label="ISBN:"
						type="number"
						placeholder="Digite aqui:"
						{...register("isbn", {
							required: true,
							minLength: { value: 10, message: "O ISBN tem no mínimo 10 números." },
							maxLength: { value: 13, message: "O ISBN tem no máximo 13 números." },
							onBlur: () => {
								if (!getValues("isbn")) return;
								startFetching(() => {
									fetchISBN();
								});
							},
						})}
						error={errors.isbn?.message}
					/>
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
					<Select
						label="Semestre:"
						placeholder="Selecione:"
						data={[
							{ value: "1", label: "1º Semestre" },
							{ value: "2", label: "2º Semestre" },
							{ value: "3", label: "3º Semestre" },
							{ value: "4", label: "4º Semestre" },
							{ value: "5", label: "5º Semestre" },
							{ value: "6", label: "6º Semestre" },
							{ value: "7", label: "7º Semestre" },
							{ value: "8", label: "8º Semestre" },
						]}
						clearable={false}
						allowDeselect={false}
						value={semester}
						onChange={selected => {
							setSemester(selected || "1");
							setValue("semester", Number(selected) || 1);
						}}
						checkIconPosition="right"
					/>
					<TagsInput
						label="Matérias:"
						placeholder="Digite aqui:"
						description="Digite uma matéria e pressione Enter para adicionar."
						value={disciplines}
						onChange={values => {
							setDisciplines(values);
							setValue("disciplines", values);
						}}
						clearable
						error={errors.disciplines?.message}
					/>
					<TagsInput
						label="Temas:"
						placeholder="Digite aqui:"
						description="Digite um tópico e pressione Enter para adicionar."
						value={topics}
						onChange={values => {
							setTopics(values);
							setValue("topics", values);
						}}
						clearable
						error={errors.topics?.message}
					/>

					<Dropzone
						className="mb-2 mt-3"
						onDrop={files => setFile(files[0])}
						onReject={() => {
							setFile(undefined);
							notifications.show({
								title: "Erro",
								message: "O arquivo selecionado não é válido.",
								color: "red",
							});
						}}
						accept={PDF_MIME_TYPE}
						maxSize={100 * 10 ** 6}
						maxFiles={1}
						multiple={false}
						loading={isSubmitting}
					>
						<Group
							justify="center"
							gap="xl"
							mih={100}
						>
							<Dropzone.Accept>
								<LuFileCheck2 className="text-5xl" />
							</Dropzone.Accept>
							<Dropzone.Reject>
								<MdFileUploadOff className="text-5xl" />
							</Dropzone.Reject>
							<Dropzone.Idle>
								<MdUpload className="text-5xl" />
							</Dropzone.Idle>

							<div className="flex flex-col">
								<h2 className="text-lg font-bold">
									{file ? (
										<>
											Arquivo selecionado: <span className="truncate italic">{file.name}</span>
										</>
									) : (
										<>Arraste e solte o arquivo do livro</>
									)}
								</h2>
								<span className="text-sm font-light">
									{file ? (
										<>Solte ou selecione para trocar o arquivo.</>
									) : (
										<>ou clique para selecionar</>
									)}
								</span>
							</div>
						</Group>
					</Dropzone>
				</section>
				<div className="flex w-full items-center justify-end">
					<Button
						type="submit"
						loading={isSubmitting}
						radius="xl"
					>
						Publicar
					</Button>
				</div>
			</form>
		</>
	);
});
