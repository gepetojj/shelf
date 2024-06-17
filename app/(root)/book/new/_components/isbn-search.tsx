"use client";

import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { ListRelevantUseCase } from "@/core/app/file-external/list-relevant.use-case";
import { FileExternal, FileExternalProps } from "@/core/domain/entities/file-external";
import { container } from "@/core/infra/container";
import { Registry } from "@/core/infra/container/registry";
import { Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Fields = {
	title: string;
};

type ISBNSearchProps = {
	selected: FileExternalProps | undefined;
	setSelected: (val: FileExternalProps | undefined) => void;
};

export const ISBNSearch: React.FC<ISBNSearchProps> = memo(function ISBNSearch({ selected, setSelected }) {
	const {
		register,
		getValues,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<Fields>();
	const [isOpen, { open, close }] = useDisclosure(false);

	const [options, setOptions] = useState<FileExternal[]>([]);

	const search = useCallback(async () => {
		const title = getValues("title");
		const books = await container
			.get<ListRelevantUseCase>(Registry.ListRelevantUseCase)
			.execute(title)
			.catch(() => []);

		if (!books.length) {
			setError("title", { message: "Nenhuma correspondência foi encontrada.", type: "value" });
			return;
		}

		setOptions(books);
		open();
	}, [getValues, setError, open]);

	return (
		<>
			<TextInput
				label="Título do livro:"
				description={selected && `Livro selecionado: ${selected.title}`}
				placeholder="Digite aqui:"
				{...register("title", {
					required: true,
					onBlur: () => {
						clearErrors("title");
						if (!getValues("title")) return;
						search();
					},
				})}
				error={errors.title?.message}
			/>

			<Modal
				opened={isOpen}
				onClose={close}
				title="Selecione o livro"
				centered
			>
				<section className="flex h-full w-full flex-col divide-y divide-white/5">
					{options.length ? (
						options.map(option => (
							<button
								type="button"
								key={option.globalIdentifier}
								className="flex w-full flex-col break-words rounded-md p-2 text-left text-sm leading-tight duration-200 hover:bg-main-foreground"
								onClick={() => {
									setSelected(option.toJSON());
									setValue("title", option.title);
									close();
								}}
							>
								<h2 className="break-words">{option.title}</h2>
								{option.subtitle && (
									<h3 className="break-words pb-1 text-xs text-neutral-200">{option.subtitle}</h3>
								)}
								{option.authors.length > 0 && (
									<h4 className="w-full break-words text-neutral-200">
										Autores(as):{" "}
										{new Intl.ListFormat("pt-br", {
											style: "long",
											type: "conjunction",
										}).format(option.authors.slice(0, 2))}
									</h4>
								)}
								{option.globalIdentifier && (
									<h4 className="truncate text-neutral-200">ISBN: {option.globalIdentifier}</h4>
								)}
							</button>
						))
					) : (
						<div className="w-full text-center">
							<span>Não há resultados.</span>
						</div>
					)}
				</section>
			</Modal>
		</>
	);
});
