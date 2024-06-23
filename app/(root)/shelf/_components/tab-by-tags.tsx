import Link from "next/link";
import { memo, useMemo } from "react";

import { api } from "@/trpc/react";
import { IconCategory2 } from "@tabler/icons-react";

export const TabByTags: React.FC = memo(function TabByTags({}) {
	const { data } = api.fileTags.list.useQuery({ books: true });

	const disciplines = useMemo(() => {
		const vals = data?.filter(val => val.type === "DISCIPLINE") || [];
		return vals.sort((a, b) => b.posts.length - a.posts.length);
	}, [data]);

	const topics = useMemo(() => {
		const vals = data?.filter(val => val.type === "TOPIC") || [];
		return vals.sort((a, b) => b.posts.length - a.posts.length);
	}, [data]);

	return (
		<>
			<section className="flex w-full flex-col gap-6 duration-100 animate-in fade-in-40">
				<div className="flex w-full flex-col gap-4">
					<span className="text-sm text-neutral-300">Disciplinas</span>
					{disciplines.length ? (
						<ul className="flex h-full w-full flex-wrap justify-center gap-4 sm:justify-start">
							{disciplines.map(item => (
								<Link
									key={item.id}
									passHref
									href={`/?discipline=${item.id}`}
								>
									<li className="flex w-full max-w-[12rem] flex-col gap-1 rounded-md bg-main-foreground p-2 shadow-md duration-75 animate-in slide-in-from-top-5">
										<span className="break-words text-sm font-medium">{item.name}</span>
										<span className="truncate text-xs text-neutral-200">
											Essa categoria tem {item.posts.length}{" "}
											{item.posts.length === 1 ? "postagem" : "postagens"}
										</span>
									</li>
								</Link>
							))}
						</ul>
					) : (
						<div className="flex w-full flex-col items-center justify-center gap-6">
							<IconCategory2 size={48} />
							<div className="flex flex-col gap-2 text-center">
								<span className="text-xl font-medium">Ainda não há nenhum livro com disciplinas</span>
								<Link
									href="/book/new"
									className="cursor-pointer text-main hover:underline"
								>
									Seja a primeira pessoa a contribuir
								</Link>
							</div>
						</div>
					)}
				</div>
				<div className="flex w-full flex-col gap-4">
					<span className="text-sm text-neutral-300">Tópicos</span>
					{topics.length ? (
						<ul className="flex h-full w-full flex-wrap justify-center gap-4 sm:justify-start">
							{topics.map(item => (
								<Link
									key={item.id}
									passHref
									href={`/?topic=${item.id}`}
								>
									<li className="flex w-full max-w-[12rem] flex-col gap-1 rounded-md bg-main-foreground p-2 shadow-md duration-75 animate-in slide-in-from-top-5">
										<span className="break-words text-sm font-medium">{item.name}</span>
										<span className="truncate text-xs text-neutral-200">
											Essa categoria tem {item.posts.length}{" "}
											{item.posts.length === 1 ? "postagem" : "postagens"}
										</span>
									</li>
								</Link>
							))}
						</ul>
					) : (
						<div className="flex w-full flex-col items-center justify-center gap-6">
							<IconCategory2 size={48} />
							<div className="flex flex-col gap-2 text-center">
								<span className="text-xl font-medium">Ainda não há nenhum livro com disciplinas</span>
								<Link
									href="/book/new"
									className="cursor-pointer text-main hover:underline"
								>
									Seja a primeira pessoa a contribuir
								</Link>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
});
