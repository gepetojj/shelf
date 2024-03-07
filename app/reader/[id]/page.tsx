import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";

import type { Book } from "@/entities/Book";
import type { Progress } from "@/entities/Progress";
import { query } from "@/lib/query";
import { auth } from "@/models/auth";

import { Reader } from "./_components/Reader";

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
	const session = await getServerSession(auth);
	if (!session || !session.user) return redirect("/");

	const info = await query<Book>("books").id(params.id).get();
	const book = info.data();

	if (!info.exists || !book) return notFound();

	const progressInfo = await query<Progress>("progress")
		.id(session.user.id || "")
		.get();
	const progress = progressInfo.data();

	return (
		<div className="flex flex-col gap-5">
			<section
				id="reader-context"
				className="flex flex-col items-center px-6"
			>
				<span className="w-full truncate text-center text-sm text-neutral-400">
					Você está lendo {book.title}
				</span>
				<div className="flex w-full max-w-xs items-center gap-2">
					<div className="h-4 w-full rounded-xl bg-main-foreground duration-100">
						<div
							id="reader-progress"
							className="h-full animate-progress-in rounded-xl bg-main duration-100"
							style={{ width: progress?.books[book.id]?.progress || "0%" }}
						/>
					</div>
					<span
						id="reader-progress-count"
						className="text-sm text-neutral-400"
					>
						{progress?.books[book.id]?.progress || "0%"}
					</span>
				</div>
			</section>
			<section className="flex h-full w-full justify-center gap-2 px-4 pb-3">
				<Reader
					book={book}
					location={progress?.books[book.id]?.location}
				/>
			</section>

			<Script
				src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"
				strategy="worker"
			/>
		</div>
	);
}
