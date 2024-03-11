"use client";

import { memo, useMemo } from "react";

import { Autocomplete } from "@/components/ui/Autocomplete";
import { unique } from "@/lib/unique";

import { useContext } from "../Context";

export const Filters: React.FC = memo(function Component() {
	const { books, filters, setFilters } = useContext();

	const disciplines = useMemo(
		() =>
			books.length > 0
				? books.map(book => book.disciplines).reduce((prev, current) => [...prev, ...current])
				: [],
		[books],
	);
	const topics = useMemo(
		() => (books.length > 0 ? books.map(book => book.topics).reduce((prev, current) => [...prev, ...current]) : []),
		[books],
	);

	return (
		<div className="sticky top-10 flex w-full flex-col items-start gap-6 home-break:w-fit">
			<Autocomplete
				id="semester"
				label="Semestre"
				items={[
					{ id: 1, label: "1º Semestre" },
					{ id: 2, label: "2º Semestre" },
					{ id: 3, label: "3º Semestre" },
					{ id: 4, label: "4º Semestre" },
					{ id: 5, label: "5º Semestre" },
					{ id: 6, label: "6º Semestre" },
					{ id: 7, label: "7º Semestre" },
					{ id: 8, label: "8º Semestre" },
				]}
				initial={filters.semester}
				onChange={selected => setFilters({ semester: selected.id as number })}
			/>
			<Autocomplete
				id="discipline"
				label="Disciplina"
				items={[
					{ id: "", label: "Qualquer" },
					...unique(disciplines).map(item => ({ id: item.toLowerCase(), label: item })),
				]}
				initial={filters.discipline}
				onChange={selected => setFilters({ discipline: selected.id === "" ? "" : selected.label })}
			/>
			<Autocomplete
				id="topic"
				label="Tema"
				items={[
					{ id: "", label: "Qualquer" },
					...unique(topics).map(item => ({ id: item.toLowerCase(), label: item })),
				]}
				initial={filters.topic}
				onChange={selected => setFilters({ topic: selected.id === "" ? "" : selected.label })}
			/>
		</div>
	);
});
