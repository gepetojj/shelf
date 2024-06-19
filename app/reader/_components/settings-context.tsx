"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { memo } from "react";

export type SettingsContextProps = {
	totalPages: number;
	currentPage: number;
	progress: number;
	zoom: number;

	setTotalPages: (totalPages: number) => void;
	setCurrentPage: (currentPage: number) => void;
	setZoom: (zoom: number) => void;
};

const context = createContext<SettingsContextProps>(undefined!);

export const SettingsProvider: React.FC<React.PropsWithChildren> = memo(function SettingsProvider({ children }) {
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [zoom, setZoom] = useState(1);

	const progress = useMemo(() => {
		if (totalPages === 0) return 0;
		return Math.round((currentPage / totalPages) * 100);
	}, [currentPage, totalPages]);

	return (
		<context.Provider value={{ totalPages, currentPage, progress, zoom, setTotalPages, setCurrentPage, setZoom }}>
			{children}
		</context.Provider>
	);
});

export const useSettings = () => useContext(context);
