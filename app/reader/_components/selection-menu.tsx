"use client";

import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";

import { api } from "@/trpc/react";
import { ActionIcon, Button, Modal, Stack, Text, Textarea, Tooltip, Transition } from "@mantine/core";
import { useClickOutside, useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCopy, IconHighlight, IconMessagePlus, IconSend } from "@tabler/icons-react";

import { useSettings } from "./settings-context";

export type SelectionMenuProps = {};

export const SelectionMenu: React.FC<React.PropsWithChildren<SelectionMenuProps>> = memo(function SelectionMenu({
	children,
}) {
	const { currentPage, fileId } = useSettings();
	const createHighlight = api.fileAnnotations.highlight.useMutation();
	const createAnnotation = api.fileAnnotations.comment.useMutation();

	const [open, handlers] = useDisclosure(false);
	const [modalOpen, modalHandlers] = useDisclosure(false);
	const [modalAnnotation, setModalAnnotation] = useState("");

	const menuRef = useClickOutside(() => close());
	const [selection, setSelection] = useState("");
	const [location, setLocation] = useState<DOMRect | undefined>(undefined);

	const close = useCallback(() => {
		handlers.close();
	}, [handlers]);

	const handleSelection = useDebouncedCallback(() => {
		setSelection("");
		const selection = window.getSelection();

		let parent = selection?.anchorNode?.parentElement;
		while (parent && !parent.id.includes("select-menu-bounds")) {
			parent = parent.parentElement;
		}
		if (!parent?.id.includes("select-menu-bounds")) return close();
		if (!selection?.toString()) return close();

		setSelection(selection.toString());
		setLocation(selection.getRangeAt(0).getBoundingClientRect());
		handlers.open();
	}, 500);

	useEffect(() => {
		document.addEventListener("selectionchange", handleSelection);
		return () => {
			document.removeEventListener("selectionchange", handleSelection);
		};
	}, [close, handleSelection, handlers]);

	return (
		<>
			<Modal
				opened={modalOpen}
				onClose={modalHandlers.close}
				title="Adicionar anotação"
				centered
			>
				<Stack gap={10}>
					<Text
						size="sm"
						className="w-full truncate"
					>
						Texto selecionado: {selection}
					</Text>
					<Textarea
						label="Escreva sua anotação:"
						placeholder="Digite aqui"
						value={modalAnnotation}
						onChange={event => setModalAnnotation(event.currentTarget.value)}
					/>
					<div className="flex w-full justify-end">
						<Button
							variant="light"
							size="xs"
							rightSection={<IconSend size={18} />}
							onClick={() => {
								createAnnotation.mutate(
									{
										fileId,
										page: currentPage,
										text: selection,
										comment: modalAnnotation,
									},
									{
										onError: error => {
											notifications.show({
												title: "Erro ao anotar trecho",
												message: error.message || "Houve um erro desconhecido.",
												color: "red",
											});
										},
									},
								);
								close();
								modalHandlers.close();
							}}
						>
							Adicionar
						</Button>
					</div>
				</Stack>
			</Modal>

			<div id="select-menu-bounds">
				<Transition
					mounted={open}
					transition="pop"
					duration={400}
					timingFunction="ease"
				>
					{styles => (
						<div
							ref={menuRef}
							className={clsx(
								"absolute z-10 flex items-center justify-center gap-2 rounded-md bg-main-foreground p-2 shadow-md",
								styles,
							)}
							style={{
								top: (location?.bottom || 0) + 10,
								left: (location?.left || 0) + (location?.width || 0) / 2 - 55,
							}}
						>
							<Tooltip
								label="Marcar trecho"
								offset={15}
								withArrow
							>
								<ActionIcon
									variant="light"
									onClick={() => {
										createHighlight.mutate(
											{ fileId, page: currentPage, text: selection },
											{
												onError: error => {
													notifications.show({
														title: "Erro ao marcar trecho",
														message: error.message || "Houve um erro desconhecido.",
														color: "red",
													});
												},
											},
										);
										close();
									}}
								>
									<IconHighlight size={18} />
								</ActionIcon>
							</Tooltip>
							<Tooltip
								label="Adicionar anotação"
								offset={15}
								withArrow
							>
								<ActionIcon
									variant="light"
									onClick={() => {
										modalHandlers.open();
										close();
									}}
								>
									<IconMessagePlus size={18} />
								</ActionIcon>
							</Tooltip>
							<Tooltip
								label="Copiar trecho"
								offset={15}
								withArrow
							>
								<ActionIcon
									variant="light"
									onClick={() => {
										// setClipboard(selectedText);
										close();
									}}
								>
									<IconCopy size={18} />
								</ActionIcon>
							</Tooltip>
						</div>
					)}
				</Transition>

				{children}
			</div>
		</>
	);
});
