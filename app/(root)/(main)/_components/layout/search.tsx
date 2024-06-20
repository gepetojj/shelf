"use client";

import { memo, useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import { notifications } from "@mantine/notifications";
import { IconSearch, IconSettings } from "@tabler/icons-react";

import { useContext } from "../context";

interface Fields {
	query: string;
}

export const Search: React.FC = memo(function Search() {
	const { drawerActions, setSearchResults } = useContext();
	const { register, handleSubmit } = useForm<Fields>();
	const search = api.useUtils().files.search;

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			setSearchResults(undefined);
			const query = fields.query;
			const result = await search.fetch({ query }, { retry: false }).catch(() => undefined);
			if (!result || result.books.length === 0) {
				notifications.show({
					title: "Nenhum resultado encontrado.",
					message: "Tente novamente com outra pesquisa.",
					color: "red",
				});
				return;
			}
			setSearchResults(result.books);
		},
		[search, setSearchResults],
	);

	return (
		<form
			className="flex w-full items-center justify-center gap-3"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex w-full max-w-md">
				<input
					placeholder="Busque por título, autor, tema:"
					autoComplete="none"
					className="w-full rounded-l-xl bg-neutral-800 p-2 px-3 outline-none placeholder:text-neutral-600"
					{...register("query", { required: true })}
				/>
				<button
					type="submit"
					className="flex items-center justify-center rounded-r-xl bg-main p-1 px-1.5 text-black duration-200 hover:brightness-90"
				>
					<span className="sr-only">Botão para executar pesquisa.</span>
					<IconSearch size={20} />
				</button>
			</div>
			<div className="inline home-break:hidden">
				<button
					type="button"
					title="Configurações de pesquisa"
					onClick={drawerActions.toggle}
					className="rounded-md p-2 duration-200 hover:bg-neutral-800"
				>
					<IconSettings size={20} />
				</button>
			</div>
		</form>
	);
});
