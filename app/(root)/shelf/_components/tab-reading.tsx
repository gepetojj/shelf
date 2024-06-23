import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

import { api } from "@/trpc/react";
import { AspectRatio, Button } from "@mantine/core";
import { IconBookOff } from "@tabler/icons-react";

export const TabReading: React.FC = memo(function TabReading({}) {
	const { data } = api.progress.list.useQuery();

	const reading = useMemo(() => {
		const items = data?.filter(item => item.page < item.book.pages * 0.96) || [];
		return items.sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf());
	}, [data]);

	return (
		<>
			<section className="duration-100 animate-in fade-in-40">
				{reading.length ? (
					<ul className="flex h-full w-full flex-wrap justify-center gap-4 sm:justify-start">
						{reading.map((item, index) => (
							<li
								key={`prgs-${item.bookId}-${item.fileId}`}
								className="flex w-full max-w-[13rem] flex-col gap-3 rounded-md bg-main-foreground p-2 shadow-md duration-75 animate-in slide-in-from-top-5"
							>
								{/* TODO: Handle when book has no thumbnail */}
								<AspectRatio ratio={100 / 136}>
									<Link
										href={`/book/${item.bookId}`}
										passHref
										className="flex items-center justify-center"
									>
										<Image
											src={item.book.smallThumbnail || item.book.largeThumbnail || ""}
											alt={`Imagem de capa do livro '${item.book.title}'`}
											width={182.5}
											height={250}
											className="max-h-[250px] max-w-[182.5px] rounded-sm object-cover"
											loading={index <= 4 ? "eager" : "lazy"}
										/>
									</Link>
								</AspectRatio>
								<div className="flex flex-col">
									<span className="truncate text-sm">{item.book.title}</span>
									<span className="truncate text-xs text-neutral-200">
										{new Intl.ListFormat("pt-br", {
											style: "long",
											type: "conjunction",
										}).format(item.book.authors)}
									</span>
									<div className="mt-2 h-2 w-full rounded-2xl bg-main-background">
										<div
											className="h-full rounded-full bg-main"
											style={{ width: `${Math.round((item.page / item.book.pages) * 100)}px` }}
										/>
									</div>
								</div>
								<Link
									href={`reader/${item.bookId}`}
									passHref
								>
									<Button
										className="w-full"
										radius="xl"
										size="xs"
										color="blue"
									>
										Continuar
									</Button>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className="flex w-full flex-col items-center justify-center gap-6">
						<IconBookOff size={48} />
						<div className="flex flex-col gap-2 text-center">
							<span className="text-xl font-medium">Você ainda não iniciou nenhum livro</span>
							<Link
								href="/"
								className="cursor-pointer text-main hover:underline"
							>
								Procure a sua próxima leitura
							</Link>
						</div>
					</div>
				)}
			</section>
		</>
	);
});
