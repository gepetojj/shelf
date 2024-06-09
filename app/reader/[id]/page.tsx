import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PDFViewer } from "@/components/ui/pdf-viewer";
import type { Book } from "@/entities/Book";
import { query } from "@/lib/query";
import { Loader } from "@mantine/core";

import { Reader } from "./_components/Reader";

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
	const info = await query<Book>("books").id(params.id).get();
	const book = info.data();

	if (!info.exists || !book) return notFound();

	// const progressInfo = await query<Progress>("progress")
	// 	.id(session.user.id || "")
	// 	.get();
	// const progress = progressInfo.data();

	return (
		<div className="flex flex-col gap-5">
			<section
				id="reader-context"
				className="flex flex-col items-center px-6"
			>
				<span className="w-full truncate text-center text-sm text-neutral-400">
					Você está lendo {book.title}
				</span>
				<div className="hidden w-full max-w-xs items-center gap-2">
					<div className="h-4 w-full rounded-xl bg-main-foreground duration-100">
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
					{/* <Reader
						book={book}
						location={undefined}
					/> */}
					<PDFViewer location={book.files[0].location} />
				</Suspense>
			</section>
		</div>
	);
}
