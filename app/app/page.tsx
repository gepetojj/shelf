import type { Book } from "@/entities/Book";
import { query, resolver } from "@/lib/query";

import { Books } from "./_components/Books";
import { ContextProvider } from "./_components/Context";
import { Filters } from "./_components/Filters";
import { Header } from "./_components/Header";

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
			<section className="flex w-full flex-col">
				<Header />
				<Books />
			</section>
			<aside className="sticky w-1/2">
				<Filters />
			</aside>
		</ContextProvider>
	);
}
