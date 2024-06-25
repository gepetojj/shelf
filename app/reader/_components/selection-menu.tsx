"use client";

import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";

import { api } from "@/trpc/react";
import { ActionIcon, Button, Modal, Stack, Text, Textarea, Tooltip, Transition } from "@mantine/core";
import { useClickOutside, useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCopy, IconHighlight, IconMessagePlus, IconSend } from "@tabler/icons-react";

import { Substrings, getSelectedNodes } from "./annotations/nodes";
import { useSettings } from "./settings-context";

export type SelectionMenuProps = {};

export const SelectionMenu: React.FC<React.PropsWithChildren<SelectionMenuProps>> = memo(function SelectionMenu({
	children,
}) {
	const { currentPage, fileId } = useSettings();
	const createHighlight = api.fileAnnotations.highlight.useMutation();
	const createAnnotation = api.fileAnnotations.comment.useMutation();
	const annotationUtils = api.useUtils().fileAnnotations.list;

	const [open, handlers] = useDisclosure(false);
	const [modalOpen, modalHandlers] = useDisclosure(false);
	const [modalAnnotation, setModalAnnotation] = useState("");

	const menuRef = useClickOutside(() => close());
	const [selection, setSelection] = useState("");
	const [location, setLocation] = useState<DOMRect | undefined>(undefined);
	const [substrings, setSubstrings] = useState<Substrings | undefined>(undefined);

	const close = useCallback(() => {
		handlers.close();
	}, [handlers]);

	const handleSelection = useDebouncedCallback(() => {
		const selection = window.getSelection();
		if (!selection) return close();

		let parent = selection.anchorNode?.parentElement;
		while (parent && !parent.id.includes("select-menu-bounds")) {
			parent = parent.parentElement;
		}
		const metadata = selection.focusNode?.parentElement;

		if (!parent?.id.includes("select-menu-bounds")) return close();
		if (!metadata) return close();
		if (!selection.toString()) return close();

		setSelection(selection.toString());
		setLocation(selection.getRangeAt(0).getBoundingClientRect());
		const substrings = getSelectedNodes(selection.toString(), selection.getRangeAt(0));
		setSubstrings(substrings);
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
				onClose={() => {
					modalHandlers.close();
					setModalAnnotation("");
				}}
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
								if (!substrings) {
									return notifications.show({
										title: "Erro ao anotar trecho",
										message: "Você não pode anotar trechos que já foram marcados.",
										color: "red",
									});
								}

								createAnnotation.mutate(
									{
										fileId,
										page: currentPage,
										text: selection,
										substrings,
										comment: modalAnnotation,
									},
									{
										onSuccess: data => {
											annotationUtils.setData({ fileId }, annotations => [
												...(annotations || []),
												data,
											]);
										},
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
								setModalAnnotation("");
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
										if (!substrings) {
											return notifications.show({
												title: "Erro ao anotar trecho",
												message: "Você não pode marcar trechos que já foram marcados.",
												color: "red",
											});
										}

										createHighlight.mutate(
											{ fileId, page: currentPage, text: selection, substrings },
											{
												onSuccess: data => {
													annotationUtils.setData({ fileId }, annotations => [
														...(annotations || []),
														data,
													]);
												},
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
										window.navigator.clipboard.writeText(selection).catch(() => {
											notifications.show({
												title: "Erro ao copiar trecho",
												message: "Seu navegador não permitiu a cópia, tente manualmente.",
												color: "red",
											});
										});
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
