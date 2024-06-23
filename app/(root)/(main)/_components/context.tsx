"use client";

import { createContext, memo, useContext as useReactContext, useState } from "react";

import { useDisclosure } from "@mantine/hooks";
import { Prisma } from "@prisma/client";

export interface Context {
	discipline: string;
	topic: string;
	searchResults:
		| Prisma.PostGetPayload<{ include: { uploader: true; tags: { include: { tag: true } } } }>[]
		| undefined;

	isDrawerOpen: boolean;
	drawerActions: ReturnType<typeof useDisclosure>[1];

	setDiscipline: (discipline: string) => void;
	setTopic: (topic: string) => void;
	setSearchResults: (data: Context["searchResults"]) => void;
}

export interface ContextProps {
	value: Omit<Context, "setQuery" | "setDiscipline" | "setTopic" | "setSearchResults" | "drawerActions">;
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
