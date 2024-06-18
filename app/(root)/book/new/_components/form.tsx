"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { FileExternalProps } from "@/core/domain/entities/file-external";
import { useAuth } from "@clerk/nextjs";
import { Button, Group, Select, TagsInput } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconFileCheck, IconFileIsr, IconFileX } from "@tabler/icons-react";

import { ISBNSearch } from "./isbn-search";

interface Fields {
	isbn: string;
	semester: number;
	disciplines: string[];
	topics: string[];
}

export interface FormProps {
	isbn?: string;
}

export const Form: React.FC<FormProps> = memo(function Form({ isbn }) {
	const router = useRouter();
	const { userId } = useAuth();
	const {
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<Fields>({ defaultValues: { isbn, semester: 1 } });

	const [book, setBook] = useState<FileExternalProps | undefined>(undefined);
	const [file, setFile] = useState<File | undefined>(undefined);

	const [semester, setSemester] = useState("1");
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
			if (!userId) {
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
					semester: fields.semester,
					disciplines: fields.disciplines,
					topics: fields.topics,
					blobs: body,
					book,
				},
				userId,
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
		[book, file, router, userId],
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
