import { Suspense } from "react";

import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";

import { ContextProvider } from "./_components/Context";
import { Filters } from "./_components/layout/Filters";
import { Books } from "./_components/ui/Books";
import { Search } from "./_components/ui/Search";

export default function Page() {
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
					<AppHeader />
					<Suspense
						fallback={
							<>
								<Search />
								<section className="flex h-full w-full flex-col gap-2 overflow-y-auto px-4 py-7 home-break-mobile:px-12">
									<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
									<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
									<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
									<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
									<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
									<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
								</section>
							</>
						}
					>
						<Books />
					</Suspense>
				</>
				<Filters />
			</Layout>
		</ContextProvider>
	);
}
