"use client";

import dynamic from "next/dynamic";
import { memo, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { api } from "@/server/trpc/react";
import { Drawer, Loader } from "@mantine/core";

import { useContext } from "../context";
import { Book } from "./book";

const Filters = dynamic(() => import("../layout/filters").then(mod => mod.Filters));

export const Manager: React.FC = memo(function Manager() {
	const { isDrawerOpen, drawerActions, searchResults, discipline, topic } = useContext();
	const [query, queryActions] = api.files.list.useSuspenseInfiniteQuery(
		{ offset: 10, discipline, topic },
		{
			getNextPageParam(last) {
				return last.length < 10 ? undefined : last[last.length - 1].id;
			},
		},
	);
	const content = useMemo(() => {
		return query.pages.flat(2);
	}, [query.pages]);

	return (
		<>
			<Drawer
				opened={isDrawerOpen}
				onClose={drawerActions.close}
				closeButtonProps={{ "aria-label": "Botão de fechar o painel de filtros" }}
				title="Filtros de pesquisa"
				style={{
					backgroundColor: "var(--tw-main-background)",
				}}
			>
				<Filters />
			</Drawer>

			{searchResults && searchResults.length > 0 && (
				<section className="flex h-fit w-full flex-col gap-2 px-4 py-2 home-break-mobile:px-12">
					<span className="text-xs text-neutral-400">Resultados da pesquisa:</span>
					{searchResults.map((book, index) => (
						<Book
							key={book.id}
							index={index}
							{...{ book }}
						/>
					))}
				</section>
			)}

			<section className="h-full w-full px-4 py-7 home-break-mobile:px-12">
				<InfiniteScroll
					className="flex w-full flex-col gap-2 py-2"
					dataLength={content.length}
					next={() => queryActions.fetchNextPage()}
					hasMore={queryActions.hasNextPage}
					loader={
						<div className="w-full text-center">
							<Loader type="dots" />
						</div>
					}
				>
					{content.length > 0 ? (
						content.map((book, index) => (
							<Book
								key={book.id}
								index={index}
								{...{ book }}
							/>
						))
					) : (
						<div className="w-full text-center duration-100 animate-in fade-in-20">
							<span className="text-lg font-semibold">Os filtros não retornaram resultados.</span>
						</div>
					)}
				</InfiniteScroll>
			</section>
		</>
	);
});
