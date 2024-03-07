"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";

import { Autocomplete, type AutocompleteItem } from "@/components/ui/Autocomplete";

export const Settings: React.FC = memo(function Component({}) {
	const [open, setOpen] = useState(false);

	const onThemeChange = useCallback((selected: AutocompleteItem) => {
		localStorage.setItem("reader-settings", JSON.stringify({ theme: selected.id }));
		const event = new CustomEvent("settings-changed");
		window.dispatchEvent(event);
	}, []);

	useEffect(() => {
		const content = document.getElementById("content");
		if (!content) return;

		const handler = () => {
			if (!open) return;
			setOpen(false);
		};

		content.addEventListener("mousedown", handler);
		content.addEventListener("touchstart", handler);
		return () => {
			content.removeEventListener("mousedown", handler);
			content.removeEventListener("touchstart", handler);
		};
	}, [open]);

	return (
		<>
			<button
				className="rounded-md bg-main p-1 text-black"
				onClick={() => setOpen(open => !open)}
			>
				<span className="sr-only">Botão para abrir as opções de leitura.</span>
				<MdMenu
					className="text-xl"
					aria-hidden="true"
				/>
			</button>

			{open ? (
				<div className="absolute right-0 top-0 z-10 flex h-full w-fit flex-col gap-4 bg-main-foreground p-4 animate-in slide-in-from-right-10">
					<span>Configurações</span>
					<Autocomplete
						id="theme"
						label="Tema"
						items={[
							{ id: "sepia", label: "Sepia" },
							{ id: "light", label: "Claro" },
							{ id: "dark", label: "Escuro" },
						]}
						initial={JSON.parse(localStorage.getItem("reader-settings") || "{}")?.theme}
						onChange={onThemeChange}
					/>
				</div>
			) : null}
		</>
	);
});
