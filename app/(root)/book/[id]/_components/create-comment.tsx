"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/server/trpc/react";
import { TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSend2 } from "@tabler/icons-react";

interface Fields {
	bookId: string;
	parentId?: string;
	comment: string;
}

export interface CreateCommentProps {
	bookId: string;
	parentId?: string;
	asResponse?: boolean;
}

export const CreateComment: React.FC<CreateCommentProps> = memo(function CreateComment({
	bookId,
	parentId,
	asResponse,
}) {
	const { register, handleSubmit } = useForm<Fields>({ defaultValues: { bookId, parentId } });
	const [loading, setLoading] = useState(false);
	const { refresh } = useRouter();
	const commentApi = api.comments.create.useMutation();

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			setLoading(true);

			const { comment, parentId, bookId } = fields;
			commentApi.mutate(
				{ bookId, parentId, text: comment },
				{
					onSettled: () => setLoading(false),
					onSuccess: data => {
						notifications.show({ title: "Sucesso", message: "Comentário criado.", color: "green" });
						return refresh();
					},
					onError: error => {
						notifications.show({
							title: "Erro",
							message: error.message || "Não foi possível criar o comentário.",
							color: "red",
						});
					},
				},
			);
		},
		[commentApi, refresh],
	);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full items-end gap-2"
		>
			<TextInput
				label={asResponse ? "Escreva sua resposta:" : "Escreva seu comentário:"}
				placeholder="Escreva aqui"
				className="w-full"
				{...register("comment", { required: true })}
			/>
			<button
				type="submit"
				disabled={loading}
				className="mt-5 rounded-md p-2 duration-200 hover:bg-main-foreground disabled:cursor-wait disabled:brightness-90"
			>
				<span className="sr-only">Botão para enviar comentário.</span>
				<IconSend2
					size={20}
					aria-hidden
				/>
			</button>
		</form>
	);
});
