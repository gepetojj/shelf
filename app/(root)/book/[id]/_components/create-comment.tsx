"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";

import { notifications } from "@mantine/notifications";

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

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			setLoading(true);

			const { comment, parentId, bookId } = fields;
			const res = await fetch("/api/comment", {
				method: "POST",
				body: JSON.stringify({ bookId, parentId, content: comment }),
			});
			const json = (await res.json()) as { message: string };

			setLoading(false);
			if (res.ok) {
				notifications.show({ title: "Sucesso", message: "Comentário criado.", color: "green" });
				return refresh();
			}

			notifications.show({
				title: "Erro",
				message: json.message || "Não foi possível criar o comentário.",
				color: "red",
			});
		},
		[refresh, setLoading],
	);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full items-center gap-2"
		>
			{/* <TextInput
				placeholder={asResponse ? "Escreva sua resposta:" : "Escreva seu comentário:"}
				autoComplete="none"
				{...register("comment", { required: true })}
			/> */}
			<button
				type="submit"
				disabled={loading}
				className="mt-5 rounded-md p-2 duration-200 hover:bg-main-foreground disabled:cursor-wait disabled:brightness-90"
			>
				<span className="sr-only">Botão para enviar comentário.</span>
				<MdSend
					className="text-xl"
					aria-hidden
				/>
			</button>
		</form>
	);
});
