import { memo } from "react";
import { HighlightMenu } from "react-highlight-menu";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconCopy, IconHighlight, IconMessagePlus } from "@tabler/icons-react";

export type SelectionMenuProps = {
	target: string;
};

export const SelectionMenu: React.FC<SelectionMenuProps> = memo(function SelectionMenu({ target }) {
	return (
		<HighlightMenu
			styles={{
				borderColor: "transparent",
				backgroundColor: "#262626",
				boxShadow: "0px 5px 5px 0px rgba(0, 0, 0, 0.15)",
				zIndex: 10,
				borderRadius: "5px",
				padding: "0.5rem",
			}}
			target={target}
			menu={({ selectedText, setMenuOpen, setClipboard }) => (
				<Group gap={8}>
					<Tooltip
						label="Marcar trecho"
						offset={15}
						withArrow
					>
						<ActionIcon
							variant="light"
							onClick={() => {
								setMenuOpen(false);
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
								setMenuOpen(false);
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
								setClipboard(selectedText);
								setMenuOpen(false);
							}}
						>
							<IconCopy size={18} />
						</ActionIcon>
					</Tooltip>
				</Group>
			)}
			allowedPlacements={["top", "bottom"]}
		/>
	);
});
