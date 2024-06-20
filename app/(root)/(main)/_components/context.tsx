"use client";

import { createContext, memo, useContext as useReactContext, useState } from "react";

import { BookProps } from "@/core/domain/entities/book";
import { useDisclosure } from "@mantine/hooks";

export interface Context {
	discipline: string;
	topic: string;
	searchResults: BookProps[] | undefined;

	isDrawerOpen: boolean;
	drawerActions: ReturnType<typeof useDisclosure>[1];

	setDiscipline: (discipline: string) => void;
	setTopic: (topic: string) => void;
	setSearchResults: (results: BookProps[] | undefined) => void;
}

export interface ContextProps {
	value: Omit<Context, "setQuery" | "setDiscipline" | "setTopic" | "drawerActions">;
}

export const Context = createContext<Context>(undefined!);

export const ContextProvider: React.FC<React.PropsWithChildren<ContextProps>> = memo(function ContextProvider({
	children,
	value,
}) {
	const [discipline, setDiscipline] = useState(value.discipline);
	const [topic, setTopic] = useState(value.topic);
	const [searchResults, setSearchResults] = useState(value.searchResults);
	const [isDrawerOpen, drawerActions] = useDisclosure(false);

	return (
		<Context.Provider
			value={{
				discipline,
				topic,
				searchResults,
				isDrawerOpen,
				drawerActions,
				setDiscipline,
				setTopic,
				setSearchResults,
			}}
		>
			{children}
		</Context.Provider>
	);
});

export const useContext = () => useReactContext(Context);
