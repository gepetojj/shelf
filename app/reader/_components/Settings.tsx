"use client";

import { memo, useCallback } from "react";
import { MdMenu } from "react-icons/md";

import { Autocomplete, type AutocompleteItem } from "@/components/ui/Autocomplete";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const Settings: React.FC = memo(function Component({}) {
	const [opened, { toggle, close }] = useDisclosure(false);

	const onThemeChange = useCallback((selected: AutocompleteItem) => {
		localStorage.setItem("reader-settings", JSON.stringify({ theme: selected.id }));
		const event = new CustomEvent("settings-changed");
		window.dispatchEvent(event);
	}, []);

	return (
		<>
			<button
				className="rounded-md bg-main p-1 text-black"
				onClick={toggle}
			>
				<span className="sr-only">Botão para abrir as opções de leitura.</span>
				<MdMenu
					className="text-xl"
					aria-hidden="true"
				/>
			</button>

			<Drawer
				opened={opened}
				onClose={close}
				title="Leitura"
			>
				<Autocomplete
					id="theme"
					label="Tema"
					items={[
						{ id: "sepia", label: "Sepia" },
						{ id: "light", label: "Claro" },
						{ id: "dark", label: "Escuro" },
					]}
					initial={
						JSON.parse(
							typeof localStorage !== "undefined"
								? localStorage.getItem("reader-settings") || "{}"
								: "{}",
						)?.theme || "sepia"
					}
					onChange={onThemeChange}
				/>
			</Drawer>
		</>
	);
});
