import React, { memo } from "react";

export const Layout: React.FC<{ children: [React.ReactElement, React.ReactElement] }> = memo(function Layout({
	children,
}) {
	if (children?.length !== 2) {
		console.warn("O Layout deve receber dois elementos!");
		return null;
	}

	return (
		<>
			<section className="flex w-full max-w-[45rem] flex-col home-break:max-w-full">{children[0]}</section>
			<aside className="sticky hidden w-1/2 px-4 home-break:inline">{children[1]}</aside>
		</>
	);
});
