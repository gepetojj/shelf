"use client";

import { memo } from "react";

import { useUser } from "@clerk/nextjs";
import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Prisma } from "@prisma/client";
import { IconAlertTriangle, IconDots, IconTrash } from "@tabler/icons-react";

import { BookSettingsReport } from "./book-settings-report";
import { BookSettingsUnpost } from "./book-settings-unpost";

export type BookSettingsProps = {
	book: Prisma.PostGetPayload<{ include: { uploader: true; tags: { include: { tag: true } } } }>;
};

export const BookSettings: React.FC<BookSettingsProps> = memo(function BookSettings({ book }) {
	const { user } = useUser();
	const [isReportModalOpen, reportModal] = useDisclosure(false);
	const [isUnpostModalOpen, unpostModal] = useDisclosure(false);

	return (
		<>
			<BookSettingsReport
				postId={book.id}
				isOpen={isReportModalOpen}
				close={reportModal.close}
			/>
			<BookSettingsUnpost
				postId={book.id}
				isOpen={isUnpostModalOpen}
				close={unpostModal.close}
			/>

			<Menu
				position="bottom-start"
				transitionProps={{ transition: "fade-down", duration: 150 }}
			>
				<Menu.Target>
					<ActionIcon
						type="button"
						title="Configurações do post"
						variant="subtle"
						color="gray"
					>
						<IconDots
							className="text-2xl text-neutral-400"
							aria-hidden="true"
						/>
					</ActionIcon>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Ações</Menu.Label>
					{user?.id !== book.uploader.externalId && (
						<Menu.Item
							color="red"
							leftSection={<IconAlertTriangle size={16} />}
							onClick={reportModal.open}
						>
							Denunciar postagem
						</Menu.Item>
					)}
					{user?.id === book.uploader.externalId && (
						<Menu.Item
							color="red"
							leftSection={<IconTrash size={16} />}
							onClick={unpostModal.open}
						>
							Deletar postagem
						</Menu.Item>
					)}
				</Menu.Dropdown>
			</Menu>
		</>
	);
});
