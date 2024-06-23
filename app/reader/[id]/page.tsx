import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { api } from "@/trpc/server";
import { Loader } from "@mantine/core";

const PDFViewer = dynamic(() => import("@/app/reader/_components/pdf-viewer").then(mod => mod.PDFViewer));

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
	const [book, progress] = await Promise.all([
		api.files.one({ id: params.id, files: true }).catch(() => notFound()),
		api.progress.one({ bookId: params.id }).catch(() => undefined),
	]);

	return (
		<div className="flex flex-col gap-5">
			<section
				id="reader-context"
				className="flex flex-col items-center px-6"
			>
				<span className="w-full truncate text-center text-sm text-neutral-400">
					Você está lendo &quot;{book.title}&quot;
				</span>
				<div className="flex w-full max-w-xs items-center gap-2">
					<div className="h-3 w-full rounded-xl bg-main-foreground duration-100">
						<div
							id="reader-progress"
							className="h-full w-0 animate-progress-in rounded-xl bg-main duration-100"
						/>
					</div>
					<span
						id="reader-progress-count"
						className="text-sm text-neutral-400"
					>
						{"0%"}
					</span>
				</div>
			</section>
			<section className="flex h-full w-full justify-center gap-2 px-4 pb-3">
				<Suspense
					fallback={
						<div className="h-full w-full">
							<Loader
								size={50}
								color="yellow"
								type="dots"
							/>
						</div>
					}
				>
					<PDFViewer
						location={book.files[0].path}
						startPage={progress?.page}
					/>
				</Suspense>
			</section>
		</div>
	);
}
