"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { IconSearch, IconSettings } from "@tabler/icons-react";

import { useContext } from "../context";

interface Fields {
	query: string;
}

export const Search: React.FC = memo(function Search() {
	const router = useRouter();
	const { query, drawerActions } = useContext();
	const { register, handleSubmit } = useForm<Fields>({ defaultValues: { query } });

	const onSubmit: SubmitHandler<Fields> = useCallback(
		async fields => {
			const query = fields.query;
			const url = new URL(window.location.href);
			url.searchParams.set("q", encodeURIComponent(query));
			router.push(url.toString());
		},
		[router],
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
