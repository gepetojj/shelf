"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { memo } from "react";

import { api } from "@/trpc/react";
import { Prisma } from "@prisma/client";

export type SettingsContextProps = {
	totalPages: number;
	currentPage: number;
	progress: number;
	zoom: number;
	annotations: Prisma.AnnotationGetPayload<{}>[];
	fileId: string;

	setTotalPages: (totalPages: number) => void;
	setCurrentPage: (currentPage: number) => void;
	setZoom: (zoom: number) => void;
};

export type SettingsProviderProps = {
	fileId: string;
};

const context = createContext<SettingsContextProps>(undefined!);

export const SettingsProvider: React.FC<React.PropsWithChildren<SettingsProviderProps>> = memo(
	function SettingsProvider({ fileId, children }) {
		const annotations = api.fileAnnotations.list.useQuery({ fileId }).data ?? [];

		const [totalPages, setTotalPages] = useState(0);
		const [currentPage, setCurrentPage] = useState(1);
		const [zoom, setZoom] = useState(1);

		const progress = useMemo(() => {
			if (totalPages === 0) return 0;
			return Math.round((currentPage / totalPages) * 100);
		}, [currentPage, totalPages]);

		return (
			<context.Provider
				value={{
					totalPages,
					currentPage,
					progress,
					zoom,
					annotations,
					fileId,
					setTotalPages,
					setCurrentPage,
					setZoom,
				}}
			>
				{children}
			</context.Provider>
		);
	},
);

export const useSettings = () => useContext(context);
