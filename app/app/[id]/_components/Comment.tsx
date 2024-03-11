"use client";

import clsx from "clsx/lite";
import Image from "next/image";
import { memo } from "react";
import { MdArrowDropDown } from "react-icons/md";

import { Time } from "@/components/ui/Time";
import type { Comment as IComment } from "@/entities/Comment";
import { Collapse, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { CreateComment } from "./CreateComment";

export interface CommentProps {
	comment: IComment;
	responses?: IComment[];
}

export const Comment: React.FC<CommentProps> = memo(function Component({ comment, responses }) {
	const [responsesOpen, { toggle }] = useDisclosure(false);

	return (
		<li className="flex w-full gap-2 py-1 text-sm">
			<div className="flex h-full items-start justify-start">
				<Image
					alt={`Imagem da conta de ${comment.creator.name}`}
					src={comment.creator.iconUrl}
					width={32}
					height={32}
					className="rounded-full"
				/>
			</div>
			<div className="flex flex-col">
				<header className="flex w-full gap-1 truncate">
					<span className="font-semibold">{comment.creator.name}</span>
					<span className="text-neutral-400">
						<Time milliseconds={comment.createdAt} />
					</span>
				</header>
				<div>
					<p>{comment.content}</p>
				</div>
				<div className="w-full pt-2">
					<Popover
						position="bottom"
						withArrow
						shadow="md"
					>
						<Popover.Target>
							<button className="rounded-2xl px-3 py-2 duration-150 hover:bg-main-foreground">
								Responder
							</button>
						</Popover.Target>
						<Popover.Dropdown>
							<CreateComment
								bookId={comment.bookId}
								parentId={comment.parentId || comment.id}
								asResponse
							/>
						</Popover.Dropdown>
					</Popover>
				</div>
				{responses && responses.length > 0 && (
					<>
						<div>
							<button
								onClick={toggle}
								className="flex items-center gap-1 rounded-2xl px-3 py-2 text-[var(--mantine-color-anchor)] duration-150 hover:bg-main-foreground"
							>
								<MdArrowDropDown
									className={clsx(
										"text-xl transition-transform duration-100",
										responsesOpen && "rotate-180",
									)}
								/>
								{responses.length !== 1 ? `${responses.length} Respostas` : `1 Resposta`}
							</button>
						</div>
						<Collapse in={responsesOpen}>
							<ul>
								{responses
									.toSorted((a, b) => a.createdAt - b.createdAt)
									.map(response => (
										<Comment
											key={response.id}
											comment={response}
										/>
									))}
							</ul>
						</Collapse>
					</>
				)}
			</div>
		</li>
	);
});
