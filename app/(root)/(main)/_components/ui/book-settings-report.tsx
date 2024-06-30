"use client";

import { memo, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/server/trpc/react";
import { Button, Modal, Radio, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { $Enums } from "@prisma/client";

export type BookSettingsReportProps = {
	postId: string;
	isOpen: boolean;
	close: () => void;
};

export type Fields = {
	motive: $Enums.Motive;
	description: string;
};

export const BookSettingsReport: React.FC<BookSettingsReportProps> = memo(function BookSettingsReport({
	postId,
	isOpen,
	close,
}) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<Fields>();

	const motive = watch("motive");
	const reportsApi = api.reports.create.useMutation();

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			if (fields.motive === "OTHER" && !fields.description) {
				setError("description", { message: "Este campo é obrigatório se o motivo for 'Outro'." });
				return;
			}

			try {
				await reportsApi.mutateAsync({
					postId,
					motive: fields.motive,
					description: fields.description,
				});
				notifications.show({
					title: "Postagem denunciada",
					message: "Sua denúncia foi enviada com sucesso. Agradecemos!",
					color: "green",
				});
				close();
			} catch (err: any) {
				notifications.show({
					title: "Erro ao denunciar postagem",
					message: err.message || "Houve um erro desconhecido.",
					color: "red",
				});
			}
		},
		[postId, reportsApi, setError, close],
	);

	return (
		<Modal
			title="Denunciar postagem"
			opened={isOpen}
			onClose={close}
			centered
		>
			<form
				className="flex flex-col gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-4">
					<Radio.Group
						label="Selecione o motivo da sua denúncia:"
						withAsterisk
						error={errors.motive?.message}
						value={motive || undefined}
						onChange={val => setValue("motive", val as $Enums.Motive)}
					>
						<div className="flex flex-col gap-1 pt-2">
							<Radio
								label="Conteúdo ofensivo"
								value="OFFENSIVE"
							/>
							<Radio
								label="Conteúdo inapropriado"
								value="INAPPROPRIATE"
							/>
							<Radio
								label="Spam"
								value="SPAM"
							/>
							<Radio
								label="Outro"
								value="OTHER"
							/>
						</div>
					</Radio.Group>
				</div>
				<Textarea
					label="Descreva o motivo da denúncia:"
					placeholder="Digite aqui (obrigatório caso o motivo seja 'Outro')"
					autosize
					{...register("description", {
						maxLength: { value: 700, message: "O número máximo de caracteres é 700." },
					})}
					error={errors.description?.message}
				/>
				<div className="flex w-full items-center justify-end">
					<Button
						type="submit"
						color="red"
						variant="light"
						loading={isSubmitting}
					>
						Denunciar
					</Button>
				</div>
			</form>
		</Modal>
	);
});
