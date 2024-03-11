import { Layout } from "@/components/ui/Layout";

import { Header } from "../_components/layout/Header";

export default async function Loading() {
	return (
		<Layout>
			<>
				<Header />
				<section className="flex h-full w-full flex-col gap-2 overflow-y-auto px-4 py-7 home-break-mobile:px-12">
					<div className="h-96 w-full animate-pulse rounded-xl bg-main-foreground"></div>
				</section>
			</>
			<></>
		</Layout>
	);
}
