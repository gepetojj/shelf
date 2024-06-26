"use client";

import { memo, useState } from "react";

import { SegmentedControl } from "@mantine/core";

import { BookForm } from "./book-form";
import { CommonForm } from "./common-form";

const FormsRegistry: { [key: string]: JSX.Element } = {
	book: <BookForm />,
	common: <CommonForm />,
};

export const Forms: React.FC = memo(function Forms() {
	const [tab, setTab] = useState("book");

	return (
		<div className="flex flex-col gap-7 px-12 py-7">
			<SegmentedControl
				withItemsBorders={false}
				data={[
					{ value: "book", label: "Livro" },
					{ value: "common", label: "Artigo/Outros" },
				]}
				value={tab}
				onChange={setTab}
			/>
			<div className="px-2">{tab in FormsRegistry ? <>{FormsRegistry[tab]}</> : null}</div>
		</div>
	);
});
