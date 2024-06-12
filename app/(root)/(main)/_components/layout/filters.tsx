"use client";

import { memo } from "react";

import { unique } from "@/lib/unique";
import { Select } from "@mantine/core";

import { useContext } from "../Context";

export const Filters: React.FC = memo(function Component() {
	const { semester, discipline, topic } = useContext();

	// const disciplines = useMemo(
	// 	() =>
	// 		books.length > 0
	// 			? books.map(book => book.disciplines).reduce((prev, current) => [...prev, ...current])
	// 			: [],
	// 	[books],
	// );
	// const topics = useMemo(
	// 	() => (books.length > 0 ? books.map(book => book.topics).reduce((prev, current) => [...prev, ...current]) : []),
	// 	[books],
	// );

	return (
		<div className="sticky top-10 flex w-full flex-col items-start gap-6 home-break:w-fit">
			<Select
				id="semester"
				label="Semestre"
				data={[
					{ value: "1", label: "1º Semestre" },
					{ value: "2", label: "2º Semestre" },
					{ value: "3", label: "3º Semestre" },
					{ value: "4", label: "4º Semestre" },
					{ value: "5", label: "5º Semestre" },
					{ value: "6", label: "6º Semestre" },
					{ value: "7", label: "7º Semestre" },
					{ value: "8", label: "8º Semestre" },
				]}
				defaultValue={semester.toString()}
			/>
			<Select
				id="discipline"
				label="Disciplina"
				data={[
					{ value: "", label: "Qualquer" },
					...unique([]).map(item => ({ value: item.toLowerCase(), label: item })),
				]}
				defaultValue={discipline}
			/>
			<Select
				id="topic"
				label="Tema"
				data={[
					{ value: "", label: "Qualquer" },
					...unique([]).map(item => ({ value: item.toLowerCase(), label: item })),
				]}
				defaultValue={topic}
			/>
		</div>
	);
});
