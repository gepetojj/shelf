import { Suspense } from "react";

import { Layout } from "@/components/ui/Layout";
import type { Book } from "@/entities/Book";
import { query, resolver } from "@/lib/query";

import { ContextProvider } from "./_components/Context";
import { Filters } from "./_components/layout/Filters";
import { Header } from "./_components/layout/Header";
import { Books } from "./_components/ui/Books";

export default async function Page() {
	const { docs } = await query<Book>("books").col.get();
	const books = resolver(docs);

	return (
		<ContextProvider
			value={{
				books,
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
					<Suspense>
						<Books />
					</Suspense>
				</>
				<Filters />
			</Layout>
		</ContextProvider>
	);
}
