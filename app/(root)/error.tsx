"use client";

import { useEffect } from "react";

import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";
import { Button } from "@mantine/core";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Layout>
			<>
				<AppHeader />
				<section className="flex h-full w-full flex-col gap-2 overflow-y-auto px-4 py-7 home-break-mobile:px-12">
					<div className="h-52 w-full animate-pulse rounded-xl bg-main-foreground" />
					<div className="w-full rounded-xl border border-red-500/80 bg-red-500/50 px-2 py-1">
						<span>Houve um erro inesperado. Recarregue a página e tente novamente.</span>
					</div>
					<Button onClick={reset}>Tentar novamente</Button>
				</section>
			</>
			<></>
		</Layout>
	);
}
