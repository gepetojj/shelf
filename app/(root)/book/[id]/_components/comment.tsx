"use client";

import clsx from "clsx/lite";
import Image from "next/image";
import { memo } from "react";
import { MdArrowDropDown } from "react-icons/md";

import { Time } from "@/components/ui/time";
import { FileCommentProps } from "@/core/domain/entities/file-comment";
import { Collapse, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { CreateComment } from "./create-comment";

export interface CommentProps {
	comment: FileCommentProps;
	responses?: FileCommentProps[];
}

export const Comment: React.FC<CommentProps> = memo(function Comment({ comment, responses }) {
	const [responsesOpen, { toggle }] = useDisclosure(false);

	return (
		<li className="flex w-full gap-2 py-1 text-sm">
			<div className="flex h-full items-start justify-start">
				<Image
					alt={`Imagem da conta de ${comment.creatorId}`}
					src={comment.creatorId}
					width={32}
					height={32}
					className="rounded-full"
				/>
			</div>
			<div className="flex flex-col">
				<header className="flex w-full gap-1 truncate">
					<span className="font-semibold">{comment.creatorId}</span>
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
								bookId={comment.fileId}
								parentId={comment.parentCommentId || comment.id}
								asResponse
							/>
						</Popover.Dropdown>
					</Popover>
				</div>
				{responses && responses.length > 0 && (
					<>
						<div>
							<button
								type="button"
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
