"use client";

import { createContext, memo, useContext as useReactContext, useState } from "react";

import { useDisclosure } from "@mantine/hooks";

export interface Context {
	query: string;
	discipline: string;
	topic: string;

	isDrawerOpen: boolean;
	drawerActions: ReturnType<typeof useDisclosure>[1];

	setQuery: (query: string) => void;
	setDiscipline: (discipline: string) => void;
	setTopic: (topic: string) => void;
}

export interface ContextProps {
	value: Omit<Context, "setQuery" | "setDiscipline" | "setTopic" | "drawerActions">;
}

export const Context = createContext<Context>(undefined!);

export const ContextProvider: React.FC<React.PropsWithChildren<ContextProps>> = memo(function ContextProvider({
	children,
	value,
}) {
	const [query, setQuery] = useState(value.query);
	const [discipline, setDiscipline] = useState(value.discipline);
	const [topic, setTopic] = useState(value.topic);
	const [isDrawerOpen, drawerActions] = useDisclosure(false);

	return (
		<Context.Provider
			value={{
				query,
				discipline,
				topic,
				isDrawerOpen,
				drawerActions,
				setQuery,
				setDiscipline,
				setTopic,
			}}
		>
			{children}
		</Context.Provider>
	);
});

export const useContext = () => useReactContext(Context);
