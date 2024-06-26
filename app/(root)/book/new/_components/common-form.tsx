"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { name } from "@/lib/name";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { Button, Group, TagsInput, TextInput, Textarea } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconFileCheck, IconFileIsr, IconFileX } from "@tabler/icons-react";

import { submission } from "../upload/client/submission";

interface Fields {
	title: string;
	description: string;
	authors?: string[];
	disciplines: string[];
	topics: string[];
}

export interface CommonFormProps {}

export const CommonForm: React.FC<CommonFormProps> = memo(function CommonForm({}) {
	const router = useRouter();
	const { user } = useUser();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<Fields>();

	const [file, setFile] = useState<File | undefined>(undefined);

	const tagsApi = api.fileTags.list.useQuery();
	const [authors, setAuthors] = useState<string[]>([]);
	const [disciplines, setDisciplines] = useState<string[]>([]);
	const [topics, setTopics] = useState<string[]>([]);

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
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
				identifier: undefined,
				title: fields.title,
				description: fields.description,
				disciplines: fields.disciplines,
				authors: fields.authors || [
					name({ first: user.firstName, last: user.lastName, username: user.username || "" }),
				],
				publishers: undefined,
				topics: fields.topics,
				file,
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
		[file, router, user],
	);

	return (
		<>
			<form
				className="flex flex-col gap-2"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-2xl font-bold">Fazer uma publicação</h1>
				<h2>Insira as informações e faça upload do arquivo.</h2>
				<section className="flex flex-col gap-2 break-words">
					<span className="pt-2 text-sm text-neutral-300">
						Campos com <span className="text-red-600">*</span> são obrigatórios.
					</span>
					<TextInput
						label="Título:"
						placeholder="Digite aqui:"
						withAsterisk
						{...register("title", {
							required: "O título é obrigatório.",
							maxLength: { value: 75, message: "O título deve ter no máximo 75 caracteres." },
						})}
						error={errors.title?.message}
					/>
					<Textarea
						label="Descrição:"
						description="Faça uma descrição objetiva e fiel ao conteúdo do arquivo."
						placeholder="Digite aqui:"
						withAsterisk
						{...register("description", {
							maxLength: { value: 1000, message: "A descrição deve ter no máximo 1000 caracteres." },
						})}
						error={errors.description?.message}
						autosize
						minRows={2}
					/>
					<TagsInput
						label="Autores:"
						placeholder="Digite e pressione Enter para adicionar:"
						description="Não preencha caso a autoria seja sua."
						value={authors}
						onChange={values => {
							setAuthors(values);
							setValue("authors", values);
						}}
						clearable
						error={errors.authors?.message}
						tabIndex={-1}
						splitChars={[",", "|"]}
						maxTags={10}
					/>
					<TagsInput
						label="Matérias:"
						placeholder="Digite e pressione Enter para adicionar:"
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
						withAsterisk
					/>
					<TagsInput
						label="Temas:"
						placeholder="Digite e pressione Enter para adicionar:"
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
						withAsterisk
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
										<>Arraste e solte o arquivo desejado</>
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
