"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { createContext, memo, useCallback, useMemo, useContext as useReactContext, useState } from "react";

import type { Book } from "@/entities/Book";
import type { BookApiItem } from "@/lib/booksApi";

export interface Context {
	books: Book[];
	filteredBooks: Book[];
	apiBooks: BookApiItem[];
	filters: {
		query: string;
		semester: number;
		discipline: string;
		topic: string;
	};

	setBooks: (books: Book[]) => void;
	setApiBooks: (apiBooks: BookApiItem[]) => void;
	setFilters: (filters: Partial<Context["filters"]>) => void;
}

export interface ContextProps {
	value: Omit<Context, "apiBooks" | "filteredBooks" | "setBooks" | "setApiBooks" | "setFilters">;
}

export const searchOptions: IFuseOptions<Book> = {
	threshold: 0.6,
	useExtendedSearch: true,
	keys: ["title", "subtitle", "authors", "publishers", "isbn10", "isbn13", "disciplines", "topics"],
};

export const Context = createContext<Context>(undefined!);

export const ContextProvider: React.FC<React.PropsWithChildren<ContextProps>> = memo(function Component({
	children,
	value,
}) {
	const [books, setBooks] = useState(value.books);
	const [apiBooks, setApiBooks] = useState<BookApiItem[]>([]);
	const [filters, setStateFilters] = useState(value.filters);

	const filteredBooks = useMemo(() => {
		const filtered = books
			.filter(
				book =>
					book.semester === filters.semester &&
					(filters.discipline ? book.disciplines.includes(filters.discipline) : true) &&
					(filters.topic ? book.topics.includes(filters.topic) : true),
			)
			.toSorted((a, b) => b.uploadedAt - a.uploadedAt);

		const fuse = new Fuse(filtered, searchOptions);
		const search = fuse.search(filters.query).map(val => val.item);

		return filters.query ? search : filtered;
	}, [books, filters]);

	const setFilters: Context["setFilters"] = useCallback(newFilters => {
		setStateFilters(filters => ({ ...filters, ...newFilters }));
	}, []);

	return (
		<Context.Provider
			value={{
				books,
				apiBooks,
				filteredBooks,
				filters,
				setBooks,
				setApiBooks,
				setFilters,
			}}
		>
			{children}
		</Context.Provider>
	);
});

export const useContext = () => useReactContext(Context);
