"use client";

import { memo, useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { MdSearch, MdSettings } from "react-icons/md";

import { queryBooks } from "@/lib/booksApi";

import { useContext } from "../Context";

interface Fields {
	query: string;
}

export interface SearchProps {
	toggleDrawer?: () => void;
}

export const Search: React.FC<SearchProps> = memo(function Component({ toggleDrawer }) {
	const { filters, setFilters, setApiBooks } = useContext();
	const { register, handleSubmit } = useForm<Fields>({ defaultValues: { query: filters.query } });

	const fetchBooksApi = useCallback(
		async (query: string) => {
			const response = await queryBooks(query);
			setApiBooks(response);
		},
		[setApiBooks],
	);

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			const { query } = fields;
			setFilters({ query });
			await fetchBooksApi(query);
		},
		[fetchBooksApi, setFilters],
	);

	return (
		<form
			className="flex w-full items-center justify-center gap-3"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex w-full max-w-md">
				<input
					placeholder="Busque por título, autor, ISBN, tema:"
					autoComplete="none"
					className="w-full rounded-l-xl bg-neutral-800 p-2 px-3 outline-none placeholder:text-neutral-600"
					{...register("query", { required: true })}
				/>
				<button
					type="submit"
					className="flex items-center justify-center rounded-r-xl bg-main p-1 px-1.5 text-black duration-200 hover:brightness-90"
				>
					<span className="sr-only">Botão para executar pesquisa.</span>
					<MdSearch className="text-xl" />
				</button>
			</div>
			<div className="inline home-break:hidden">
				<button
					type="button"
					title="Configurações de pesquisa"
					onClick={toggleDrawer}
					className="rounded-md p-2 duration-200 hover:bg-neutral-800"
				>
					<MdSettings className="text-xl" />
				</button>
			</div>
		</form>
	);
});

