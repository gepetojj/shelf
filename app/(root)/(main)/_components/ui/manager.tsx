"use client";

import dynamic from "next/dynamic";
import { memo, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { api } from "@/trpc/react";
import { Drawer, Loader } from "@mantine/core";

import { useContext } from "../context";
import { Book } from "./book";

const Filters = dynamic(() => import("../layout/filters").then(mod => mod.Filters));

export const Manager: React.FC = memo(function Manager() {
	const { isDrawerOpen, drawerActions } = useContext();
	const [query, queryActions] = api.files.list.useSuspenseInfiniteQuery(
		{ offset: 10 },
		{
			getNextPageParam(last, _, cursor) {
				return last.books.length < 10 ? undefined : (cursor || 0) + 1;
			},
		},
	);
	const content = useMemo(() => {
		return query.pages.map(page => page.books).flat();
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

			<section className="h-full w-full gap-2 px-4 py-7 home-break-mobile:px-12">
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
