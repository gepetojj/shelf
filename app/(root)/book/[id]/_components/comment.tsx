"use client";

import clsx from "clsx/lite";
import Image from "next/image";
import { memo } from "react";

import { Time } from "@/components/ui/time";
import { name } from "@/lib/name";
import { Collapse, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Prisma } from "@prisma/client";
import { IconChevronDown } from "@tabler/icons-react";

import { CreateComment } from "./create-comment";

export interface CommentProps {
	comment: Prisma.CommentGetPayload<{ include: { owner: true } }>;
	responses?: Prisma.CommentGetPayload<{ include: { owner: true } }>[];
}

export const Comment: React.FC<CommentProps> = memo(function Comment({ comment, responses }) {
	const [responsesOpen, { toggle }] = useDisclosure(false);

	return (
		<li className="flex w-full gap-2 py-1 text-sm">
			<div className="flex h-full items-start justify-start">
				<Image
					alt={`Imagem da conta de ${comment.owner.username}`}
					src={comment.owner.profileImageUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
					width={32}
					height={32}
					className="rounded-full"
				/>
			</div>
			<div className="flex flex-col">
				<header className="flex w-full gap-1 truncate">
					<span className="font-semibold">
						{name({
							first: comment.owner.firstName,
							last: comment.owner.lastName,
							username: comment.owner.username,
						})}
					</span>
					<span className="text-neutral-400">
						<Time milliseconds={comment.createdAt.valueOf()} />
					</span>
				</header>
				<div>
					<p>{comment.textContent}</p>
				</div>
				<div className="w-full pt-2">
					<Popover
						position="bottom"
						withArrow
						shadow="md"
					>
						<Popover.Target>
							<button
								type="button"
								className="rounded-2xl px-3 py-2 duration-150 hover:bg-main-foreground"
							>
								Responder
							</button>
						</Popover.Target>
						<Popover.Dropdown>
							<CreateComment
								bookId={comment.postId}
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
								type="button"
								onClick={toggle}
								className="flex items-center gap-1 rounded-2xl px-3 py-2 text-[var(--mantine-color-anchor)] duration-150 hover:bg-main-foreground"
							>
								<IconChevronDown
									size={20}
									className={clsx("transition-transform duration-100", responsesOpen && "rotate-180")}
								/>
								{responses.length !== 1 ? `${responses.length} Respostas` : `1 Resposta`}
							</button>
						</div>
						<Collapse in={responsesOpen}>
							<ul>
								{responses
									.toSorted((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf())
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
