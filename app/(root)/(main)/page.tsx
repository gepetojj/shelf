import { Suspense } from "react";

import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";

import { ContextProvider } from "./_components/context";
import { Filters } from "./_components/layout/filters";
import { Search } from "./_components/layout/search";
import { Manager } from "./_components/ui/manager";

export default function Page({
	searchParams,
}: Readonly<{ searchParams: { discipline?: string | string[] | null; topic?: string | string[] | null } }>) {
	return (
		<ContextProvider
			value={{
				isDrawerOpen: false,
				discipline: typeof searchParams.discipline === "string" ? searchParams.discipline : "",
				topic: typeof searchParams.topic === "string" ? searchParams.topic : "",
				searchResults: [],
			}}
		>
			<Layout>
				<>
					<AppHeader />
					<Search />
					<Suspense
						fallback={
							<section className="flex h-full w-full flex-col gap-2 overflow-y-auto px-4 py-7 home-break-mobile:px-12">
								<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
								<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
								<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
								<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
								<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
								<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
							</section>
						}
					>
						<Manager />
					</Suspense>
				</>
				<Filters />
			</Layout>
		</ContextProvider>
	);
}
