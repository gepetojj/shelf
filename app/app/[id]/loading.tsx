import { Layout } from "@/components/ui/Layout";

import { Header } from "../_components/layout/Header";

export default async function Loading() {
	return (
		<Layout>
			<>
				<Header />
				<section className="flex h-full w-full flex-col gap-4 overflow-y-auto px-4 py-7 home-break-mobile:px-12">
					<div className="h-24 w-full animate-pulse rounded-md bg-main-foreground"></div>
					<div className="h-56 w-full animate-pulse rounded-md bg-main-foreground"></div>
					<div className="h-32 w-full animate-pulse rounded-md bg-main-foreground"></div>
				</section>
			</>
			<div className="sticky top-10 w-full max-w-56 animate-pulse rounded-md bg-main-foreground">
				<div className="h-80 w-full bg-main-foreground brightness-90" />
				<div className="h-10 w-full rounded-2xl bg-main" />
			</div>
		</Layout>
	);
}
