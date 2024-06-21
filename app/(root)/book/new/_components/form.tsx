"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { FileExternalProps } from "@/core/domain/entities/file-external";
import { useUser } from "@clerk/nextjs";
import { Button, Group, TagsInput } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconFileCheck, IconFileIsr, IconFileX } from "@tabler/icons-react";

import { ISBNSearch } from "./isbn-search";

interface Fields {
	isbn: string;
	disciplines: string[];
	topics: string[];
}

export interface FormProps {
	isbn?: string;
}

export const Form: React.FC<FormProps> = memo(function Form({ isbn }) {
	const router = useRouter();
	const { user } = useUser();
	const {
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<Fields>({ defaultValues: { isbn } });

	const [book, setBook] = useState<FileExternalProps | undefined>(undefined);
	const [file, setFile] = useState<File | undefined>(undefined);

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

			const body = new FormData();
			body.append("file", file);

			const { upload } = await import("../actions/upload");
			const result = await upload(
				{
					disciplines: fields.disciplines,
					topics: fields.topics,
					blobs: body,
					book,
				},
				{
					id: user.id,
					name: user.fullName || user.username || "Usuário sem nome",
					avatarUrl: user.imageUrl,
				},
			);

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
				className="flex flex-col gap-2 px-12 py-7"
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
