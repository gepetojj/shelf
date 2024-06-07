export default async function Layout() {
	return (
		<div className="flex flex-col gap-5">
			<section
				id="reader-context"
				className="flex items-center gap-1 px-6"
			>
				<span className="w-full truncate text-center text-sm text-neutral-400">Você está lendo</span>
				<div className="w-10 animate-pulse rounded-md bg-main-foreground" />
			</section>
			<section className="flex h-full w-full items-center justify-center">
				<div className="h-96 w-52 animate-pulse rounded-md bg-main-foreground" />
			</section>
		</div>
	);
}
