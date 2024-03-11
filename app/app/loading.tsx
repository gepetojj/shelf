import { Layout } from "@/components/ui/Layout";

import { ContextProvider } from "./_components/Context";
import { Filters } from "./_components/layout/Filters";
import { Header } from "./_components/layout/Header";
import { Search } from "./_components/ui/Search";

export default async function Loading() {
	return (
		<ContextProvider
			value={{
				books: [],
				filters: {
					query: "",
					semester: 1,
					discipline: "",
					topic: "",
				},
			}}
		>
			<Layout>
				<>
					<Header />
					<Search />
					<section className="flex h-full w-full flex-col gap-2 overflow-y-auto px-4 py-7 home-break-mobile:px-12">
						<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground"></div>
						<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground"></div>
					</section>
				</>
				<Filters />
			</Layout>
		</ContextProvider>
	);
}
