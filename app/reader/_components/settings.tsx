"use client";

import { memo } from "react";

import { Drawer, NumberInput, Slider, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu } from "@tabler/icons-react";

import { useSettings } from "./settings-context";

export const Settings: React.FC = memo(function Settings({}) {
	const { currentPage, totalPages, zoom, setCurrentPage, setZoom } = useSettings();
	const [opened, { toggle, close }] = useDisclosure(false);

	// const onThemeChange = useCallback((selected: AutocompleteItem) => {
	// 	localStorage.setItem("reader-settings", JSON.stringify({ theme: selected.id }));
	// 	const event = new CustomEvent("settings-changed");
	// 	window.dispatchEvent(event);
	// }, []);

	return (
		<>
			<button
				className="rounded-md bg-main p-1 text-black"
				onClick={toggle}
			>
				<span className="sr-only">Botão para abrir as opções de leitura.</span>
				<IconMenu
					size={20}
					aria-hidden="true"
				/>
			</button>

			<Drawer
				opened={opened}
				onClose={close}
				title="Leitura"
			>
				<Stack gap={10}>
					<NumberInput
						label="Altere a página:"
						description="Escolha a página que deseja ler."
						value={currentPage}
						min={1}
						minLength={1}
						max={totalPages}
						maxLength={totalPages.toString().length}
						onChange={value => {
							const page = Number(value);
							if (page < 1 || page > totalPages) return;
							setCurrentPage(page);
						}}
						stepHoldDelay={500}
						stepHoldInterval={100}
						allowDecimal={false}
						allowNegative={false}
					/>

					<div>
						<Text
							size="sm"
							className="pb-2"
						>
							Altere o zoom:
						</Text>
						<Slider
							value={zoom * 100}
							min={100}
							max={125}
							marks={[
								{ value: 100, label: "100%" },
								{ value: 125, label: "125%" },
							]}
							onChange={value => {
								if (value < 100 || value > 125) return;
								setZoom(value / 100);
							}}
						/>
					</div>
				</Stack>
			</Drawer>
		</>
	);
});
