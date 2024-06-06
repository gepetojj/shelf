"use client";

import clsx from "clsx/lite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";
import { IconType } from "react-icons/lib";
import {
	MdBookmark,
	MdBookmarkBorder,
	MdHome,
	MdNotifications,
	MdNotificationsNone,
	MdOutlineHome,
	MdPostAdd,
} from "react-icons/md";

type NavOption = {
	href: string;
	label: string;
	deep?: boolean;
	Icon: IconType;
	ActiveIcon: IconType;
};

const NAV_OPTIONS: NavOption[] = [
	{ href: "/", label: "Página inicial", Icon: MdOutlineHome, ActiveIcon: MdHome },
	{
		href: "/notifications",
		label: "Notificações",
		deep: true,
		Icon: MdNotificationsNone,
		ActiveIcon: MdNotifications,
	},
	{ href: "/shelf", label: "Sua estante", deep: true, Icon: MdBookmarkBorder, ActiveIcon: MdBookmark },
];

export const AppNav: React.FC = memo(function AppNav() {
	const pathname = usePathname();

	const isActive = useCallback(
		(option: NavOption) => {
			if (!option.deep) return pathname === option.href;
			return pathname?.startsWith(option.href) || false;
		},
		[pathname],
	);

	return (
		<nav className="sticky top-10 flex select-none items-center justify-between gap-4 px-2 home-break-mobile:flex-col home-break-mobile:items-start home-break-mobile:justify-start home-break-mobile:gap-1 home-break-mobile:p-0 home-break:w-52">
			{NAV_OPTIONS.map(option => (
				<Link
					key={option.href}
					href={option.href}
					className={"flex w-fit items-center gap-3 rounded-3xl p-2 px-4 duration-200 hover:bg-neutral-800"}
				>
					{isActive(option) ? (
						<option.ActiveIcon className="text-2xl" />
					) : (
						<option.Icon className="text-2xl" />
					)}
					<span className={clsx("text-lg", "hidden home-break:inline", isActive(option) && "font-bold")}>
						{option.label}
					</span>
				</Link>
			))}

			<Link
				href="/book/new"
				className="flex items-center justify-center gap-3 rounded-2xl bg-main p-1 text-black duration-200 hover:brightness-90 home-break-mobile:mt-4 home-break-mobile:w-full"
			>
				<span className="hidden home-break:inline">Postar</span>
				<MdPostAdd className="inline text-2xl home-break:hidden" />
			</Link>
		</nav>
	);
});
