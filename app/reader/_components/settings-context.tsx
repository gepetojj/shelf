"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { memo } from "react";

import { api } from "@/server/trpc/react";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";

import { EndReachedEvent } from "./events/end-reached";

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
		const progressApi = api.progress.upsert.useMutation();

		const [endReachedEventOpen, endReachedEventControls] = useDisclosure(false);
		const [endReachedEventBooksRead, setEndReachedEventBooksRead] = useState(0);

		const [totalPages, setTotalPages] = useState(0);
		const [currentPage, setLocalCurrentPage] = useState(1);
		const [zoom, setZoom] = useState(1);

		const progress = useMemo(() => {
			if (totalPages === 0) return 0;
			return Math.round((currentPage / totalPages) * 100);
		}, [currentPage, totalPages]);

		const syncProgress = useDebouncedCallback((page: number) => {
			progressApi.mutate(
				{ bookId: fileId, page },
				{
					onSuccess: data => {
						if (data.events.firstTimeEndReached) {
							setEndReachedEventBooksRead(data.events.firstTImeEndReachedBooksRead);
							endReachedEventControls.open();
						}

						if (data.achievements.length > 0) {
							data.achievements.forEach(achievement => {
								notifications.show({
									title: "Eba! Conquista desbloqueada!",
									message: `${achievement.name}: ${achievement.description}`,
									color: "green",
								});
							});
						}
					},
					onError: error => {
						if (error.data?.code === "FORBIDDEN" || error.data?.code === "UNAUTHORIZED") return;
						notifications.show({
							title: "Erro ao salvar o progresso",
							message: error.message || "Houve um erro desconhecido.",
							color: "red",
						});
					},
				},
			);
		}, 1_500);

		const setCurrentPage = useCallback(
			(page: number) => {
				setLocalCurrentPage(page);
				syncProgress(page);
			},
			[syncProgress],
		);

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
				<EndReachedEvent
					show={endReachedEventOpen}
					onClose={endReachedEventControls.close}
					pagesRead={currentPage}
					booksRead={endReachedEventBooksRead}
				/>

				{children}
			</context.Provider>
		);
	},
);

export const useSettings = () => useContext(context);
