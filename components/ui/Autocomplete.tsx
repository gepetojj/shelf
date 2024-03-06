"use client";

import clsx from "clsx/lite";
import { ChangeEventHandler, memo, useCallback, useMemo, useState } from "react";
import { MdCode } from "react-icons/md";

import { Combobox } from "@headlessui/react";

export interface AutocompleteItem {
	id: string | number;
	label: string;
}

export interface AutocompleteProps {
	id: string;
	items: AutocompleteItem[];
	label?: string;
	initial?: string | number;
	initialQuery?: string;
	onChange?: (selected: AutocompleteItem) => void;
}

const getInitial = (id: string | number | undefined, items: AutocompleteItem[]) => {
	if (!id) return undefined;
	const item = items.find(item => item.id === id);
	return item;
};

export const Autocomplete: React.FC<AutocompleteProps> = memo(function Component({
	id,
	items,
	label,
	initial = undefined,
	initialQuery = "",
	onChange,
}) {
	const [selected, setSelected] = useState<AutocompleteItem | undefined>(getInitial(initial, items) || items[0]);
	const [query, setQuery] = useState(initialQuery);

	const filtered = useMemo(() => {
		return query === "" ? items : items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
	}, [items, query]);

	const onOptionChange = useCallback(
		(newItem: AutocompleteItem) => {
			setSelected(newItem);
			setQuery("");
			onChange && onChange(newItem);
		},
		[onChange],
	);

	const onQueryChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
		setQuery(e.target.value);
	}, []);

	return (
		<Combobox
			value={selected}
			defaultValue={getInitial(initial, items)}
			onChange={onOptionChange}
		>
			<div className="relative">
				<div className="flex flex-col gap-1">
					{label && (
						<label
							htmlFor={id}
							className="text-sm font-light text-neutral-200"
						>
							{label}
						</label>
					)}
					<div className="flex items-center gap-2 rounded-lg border border-white/5 bg-main-foreground p-2 px-4">
						<Combobox.Input
							id={id}
							name={label?.toLowerCase() || "options"}
							className="w-full bg-main-foreground outline-none"
							onChange={onQueryChange}
							displayValue={item => (item as AutocompleteItem).label || "Selecione"}
							placeholder="Selecione"
						/>
						<Combobox.Button>
							<span className="sr-only">Botão para abrir lista de opções.</span>
							<MdCode
								className="rotate-90 text-xl"
								aria-hidden="true"
							/>
						</Combobox.Button>
					</div>
				</div>

				<Combobox.Options
					className="absolute z-10 mt-2 flex max-h-[20rem] w-full flex-col gap-1 overflow-y-auto
					rounded-md border border-white/5 bg-main-foreground py-2 duration-100 animate-in slide-in-from-top-3"
				>
					{filtered.length > 0 ? (
						filtered.map(item => (
							<Combobox.Option
								key={crypto.randomUUID()}
								value={item}
								className={({ selected }) =>
									clsx(
										"flex cursor-pointer select-none gap-2 bg-main-foreground px-4 py-2 duration-200 hover:brightness-75",
										selected && "border-l-2 border-main",
									)
								}
							>
								{item.label}
							</Combobox.Option>
						))
					) : (
						<li className="w-full text-center">
							<span className="select-none">Nenhum item foi encontrado.</span>
						</li>
					)}
				</Combobox.Options>
			</div>
		</Combobox>
	);
});
