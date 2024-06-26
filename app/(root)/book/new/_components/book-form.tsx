"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { FileExternalProps } from "@/core/domain/entities/file-external";
import { api } from "@/server/trpc/react";
import { useUser } from "@clerk/nextjs";
import { Button, Group, TagsInput } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconFileCheck, IconFileIsr, IconFileX } from "@tabler/icons-react";

import { submission } from "../upload/client/submission";
import { ISBNSearch } from "./isbn-search";

interface Fields {
	isbn: string;
	disciplines: string[];
	topics: string[];
}

export interface BookFormProps {
	isbn?: string;
}

export const BookForm: React.FC<BookFormProps> = memo(function BookForm({ isbn }) {
	const router = useRouter();
	const { user } = useUser();
	const {
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<Fields>({ defaultValues: { isbn } });

	const [book, setBook] = useState<FileExternalProps | undefined>(undefined);
	const [file, setFile] = useState<File | undefined>(undefined);

	const tagsApi = api.fileTags.list.useQuery();
	const [disciplines, setDisciplines] = useState<string[]>([]);
	const [topics, setTopics] = useState<string[]>([]);

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
			if (!fields.disciplines?.length) {
				return notifications.show({
					title: "Erro",
					message: "Insira ao menos uma matéria antes de postar.",
					color: "red",
				});
			}
			if (!fields.topics?.length) {
				return notifications.show({
					title: "Erro",
					message: "Insira ao menos um tópico antes de postar.",
					color: "red",
				});
			}
			if (!user) {
				return notifications.show({
					title: "Erro",
					message: "Faça login ou recarregue a página.",
					color: "red",
				});
			}

			const result = await submission({
				identifier: book.globalIdentifier || undefined,
				title: book.title,
				description: book.description || "",
				disciplines: fields.disciplines,
				authors: book.authors || [],
				publishers: book.publishers || [],
				topics: fields.topics,
				file,
				thumbnailUrl: book.thumbnailUrl || undefined,
				thumbnailAltUrl: book.thumbnailAltUrl || undefined,
				userId: user.id,
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
		[book, file, router, user],
	);

	return (
		<>
			<form
				className="flex flex-col gap-2"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-2xl font-bold">Publicar um livro</h1>
				<h2>Insira as informações e faça upload do arquivo do livro.</h2>
				<section className="flex flex-col gap-2 break-words">
					<ISBNSearch
						selected={book}
						setSelected={setBook}
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
						tabIndex={-1}
						data={tagsApi.data?.filter(tag => tag.type === "DISCIPLINE").map(tag => tag.name) || []}
						splitChars={[",", "|"]}
						maxTags={10}
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
						tabIndex={-1}
						data={tagsApi.data?.filter(tag => tag.type === "TOPIC").map(tag => tag.name) || []}
						splitChars={[",", "|"]}
						maxTags={10}
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
								<IconFileCheck size={48} />
							</Dropzone.Accept>
							<Dropzone.Reject>
								<IconFileX size={48} />
							</Dropzone.Reject>
							<Dropzone.Idle>
								<IconFileIsr size={48} />
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
										<>ou clique para selecionar (máx.: 50MB)</>
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
