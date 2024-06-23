"use client";

import { memo, useMemo } from "react";

import { api } from "@/trpc/react";
import { Select } from "@mantine/core";

import { useContext } from "../context";

export const Filters: React.FC = memo(function Filters() {
	const { discipline, topic, setDiscipline, setTopic } = useContext();
	const tags = api.fileTags.list.useQuery().data;

	const disciplines = useMemo(() => {
		return tags?.filter(tag => tag.type === "DISCIPLINE") || [];
	}, [tags]);

	const topics = useMemo(() => {
		return tags?.filter(tag => tag.type === "TOPIC") || [];
	}, [tags]);

	return (
		<div className="sticky top-10 flex w-full flex-col items-start gap-6 home-break:w-fit">
			<Select
				id="discipline"
				label="Disciplina"
				data={[
					{ value: "", label: "Qualquer" },
					...disciplines.map(item => ({ value: item.name, label: item.name })),
				]}
				value={discipline}
				onChange={value => {
					setDiscipline(value || "");
					setTopic("");
				}}
				className="w-full"
				clearable={false}
			/>
			<Select
				id="topic"
				label="Tema"
				data={[
					{ value: "", label: "Qualquer" },
					...topics.map(item => ({ value: item.name, label: item.name })),
				]}
				value={topic}
				onChange={value => {
					setTopic(value || "");
					setDiscipline("");
				}}
				className="w-full"
				clearable={false}
			/>
		</div>
	);
});
