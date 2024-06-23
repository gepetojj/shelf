"use client";

import { memo, useState } from "react";

import { SegmentedControl } from "@mantine/core";

import { TabRead } from "./tab-read";
import { TabReading } from "./tab-reading";

const TabsRegistry: { [key: string]: JSX.Element } = {
	byTag: <></>,
	reading: <TabReading />,
	read: <TabRead />,
};

export const Tabs: React.FC = memo(function Tabs({}) {
	const [tab, setTab] = useState("reading");

	return (
		<div className="flex flex-col gap-10">
			<SegmentedControl
				withItemsBorders={false}
				data={[
					{ value: "byTag", label: "Categorias" },
					{ value: "reading", label: "Lendo" },
					{ value: "read", label: "Finalizados" },
				]}
				value={tab}
				onChange={setTab}
			/>
			<div className="px-2">{tab in TabsRegistry ? <>{TabsRegistry[tab]}</> : null}</div>
		</div>
	);
});
