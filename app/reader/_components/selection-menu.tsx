"use client";

import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";

import { ActionIcon, Tooltip, Transition } from "@mantine/core";
import { useClickOutside, useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { IconCopy, IconHighlight, IconMessagePlus } from "@tabler/icons-react";

export type SelectionMenuProps = {};

export const SelectionMenu: React.FC<React.PropsWithChildren<SelectionMenuProps>> = memo(function SelectionMenu({
	children,
}) {
	const [open, handlers] = useDisclosure(false);
	const menuRef = useClickOutside(() => close());
	const [selection, setSelection] = useState("");
	const [location, setLocation] = useState<DOMRect | undefined>(undefined);

	const close = useCallback(() => {
		setSelection("");
		handlers.close();
	}, [handlers]);

	const handleSelection = useDebouncedCallback(() => {
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
	);
});
