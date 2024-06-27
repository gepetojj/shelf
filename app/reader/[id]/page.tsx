import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLD } from "@/components/logic/jsonld";
import { name } from "@/lib/name";
import { getURL } from "@/lib/url";
import { api } from "@/trpc/server";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button, Loader } from "@mantine/core";
import { IconLock, IconLogin2 } from "@tabler/icons-react";

const PDFViewer = dynamic(() => import("@/app/reader/_components/pdf-viewer").then(mod => mod.PDFViewer));

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const book = await api.files.one({ id: params.id, comments: true }).catch(() => notFound());
	return {
		title: book.title,
		description: `Leia "${book.title}" no Shelf: ${book.description.slice(0, 200)}`,
		openGraph: {
			images: [
				{
					url: `${getURL()}/api/og/book?title=${book.title}`,
				},
			],
		},
	};
}

export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
	const [book, progress] = await Promise.all([
		api.files.one({ id: params.id, files: true }).catch(() => notFound()),
		api.progress.one({ bookId: params.id }).catch(() => undefined),
	]);

	return (
		<>
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
					<SignedIn>
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
					</SignedIn>

					<SignedOut>
						<div className="mt-10 flex h-full flex-col items-center justify-center gap-1 rounded-xl bg-main-foreground p-5">
							<IconLock size={48} />
							<h1 className="mt-1 text-center text-2xl">Você precisa criar uma conta para ler</h1>
							<h2 className="pb-5 text-sm text-neutral-200">
								Em menos de 1 minuto você estará acessando diversos conteúdos relevantes gratuitamente.
							</h2>
							<SignInButton
								mode="modal"
								forceRedirectUrl={`/reader/${params.id}`}
							>
								<div className="flex w-full justify-end">
									<div className="hidden w-full home-break:inline">
										<Button
											className="min-w-full shadow-sm"
											radius="xl"
											rightSection={<IconLogin2 size={20} />}
										>
											Entre já
										</Button>
									</div>
									<div className="home-break:hidden">
										<Button radius="xl">
											<IconLogin2 size={20} />
										</Button>
									</div>
								</div>
							</SignInButton>
						</div>
					</SignedOut>
				</section>
			</div>

			<JsonLD
				content={{
					"@context": "https://schema.org",
					"@type": "Book",
					"bookFormat": "EBook",
					"isbn": book.workIdentifier || undefined,
					"numberOfPages": book.pages,
					"about": book.description,
					"author": book.authors.map(author => ({ "@type": "Person", "givenName": author })),
					"comment": book.comments.map(comment => ({
						"@type": "Comment",
						"text": comment.textContent,
						"author": name({
							first: comment.owner.firstName,
							last: comment.owner.lastName,
							username: comment.owner.username,
						}),
					})),
					"commentCount": book.comments.length,
				}}
			/>
		</>
	);
}
