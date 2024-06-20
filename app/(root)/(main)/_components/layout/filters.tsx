"use client";

import { memo } from "react";

import { unique } from "@/lib/unique";
import { Select } from "@mantine/core";

import { useContext } from "../context";

export const Filters: React.FC = memo(function Filters() {
	const { discipline, topic } = useContext();

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
				id="discipline"
				label="Disciplina"
				data={[
					{ value: "", label: "Qualquer" },
					...unique([]).map(item => ({ value: item.toLowerCase(), label: item })),
				]}
				defaultValue={discipline}
				className="w-full"
			/>
			<Select
				id="topic"
				label="Tema"
				data={[
					{ value: "", label: "Qualquer" },
					...unique([]).map(item => ({ value: item.toLowerCase(), label: item })),
				]}
				defaultValue={topic}
				className="w-full"
			/>
		</div>
	);
});
