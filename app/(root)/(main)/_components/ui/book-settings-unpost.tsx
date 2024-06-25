"use client";

import { memo, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import { Button, Modal, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export type BookSettingsUnpostProps = {
	postId: string;
	isOpen: boolean;
	close: () => void;
};

export type Fields = {
	confirmation: string;
};

export const BookSettingsUnpost: React.FC<BookSettingsUnpostProps> = memo(function BookSettingsUnpost({
	postId,
	isOpen,
	close,
}) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<Fields>();

	const postsApi = api.files.delete.useMutation();
	const postsUtils = api.useUtils().files.list;

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			if (fields.confirmation !== "Eu desejo deletar") {
				return setError("confirmation", { message: "Confirmação inválida." });
			}

			try {
				await postsApi.mutateAsync({
					id: postId,
				});
				notifications.show({
					title: "Postagem removida",
					message: "Sua postagem foi removida com sucesso.",
					color: "green",
				});
				postsUtils.refetch();
				close();
			} catch (err: any) {
				notifications.show({
					title: "Erro ao remover postagem",
					message: err.message || "Houve um erro desconhecido.",
					color: "red",
				});
			}
		},
		[setError, postsApi, postId, postsUtils, close],
	);

	return (
		<Modal
			title="Deletar postagem"
			opened={isOpen}
			onClose={close}
			centered
		>
			<form
				className="flex flex-col gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-4">
					<Text size="sm">
						Você está prestes a remover sua postagem do Shelf. Essa ação é <strong>irreversível.</strong>
					</Text>
					<Text size="sm">
						Tenha consciência que sua postagem ajuda você e <strong>diversas outras pessoas</strong> a
						acessar conteúdo relevante gratuitamente.
					</Text>
				</div>
				<TextInput
					label="Digite 'Eu desejo deletar' para confirmar:"
					placeholder="Eu desejo deletar"
					{...register("confirmation", { required: "Campo obrigatório." })}
					error={errors.confirmation?.message}
				/>
				<div className="flex w-full items-center justify-end">
					<Button
						type="submit"
						color="red"
						variant="light"
						loading={isSubmitting}
					>
						Deletar
					</Button>
				</div>
			</form>
		</Modal>
	);
});
