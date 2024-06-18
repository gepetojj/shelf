"use client";

import clsx from "clsx/lite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
	IconBell,
	IconBellFilled,
	IconBookmark,
	IconBookmarkFilled,
	IconHome,
	IconHomeFilled,
	IconLogin2,
	IconTextPlus,
} from "@tabler/icons-react";

type NavOption = {
	href: string;
	signedOutHref?: string;
	label: string;
	deep?: boolean;
	Icon: any;
	ActiveIcon: any;
};

const NAV_OPTIONS: NavOption[] = [
	{ href: "/", label: "Página inicial", Icon: IconHome, ActiveIcon: IconHomeFilled },
	{
		href: "/notifications",
		signedOutHref: "/sign-in",
		label: "Notificações",
		deep: true,
		Icon: IconBell,
		ActiveIcon: IconBellFilled,
	},
	{
		href: "/shelf",
		signedOutHref: "/sign-in",
		label: "Sua estante",
		deep: true,
		Icon: IconBookmark,
		ActiveIcon: IconBookmarkFilled,
	},
];

const Option = (option: NavOption) => {
	const pathname = usePathname();
	const isActive = useCallback(
		(option: NavOption) => {
			if (!option.deep) return pathname === option.href;
			return pathname?.startsWith(option.href) || false;
		},
		[pathname],
	);

	return (
		<Link
			href={option.href}
			className={"flex w-fit items-center gap-3 rounded-3xl p-2 px-4 duration-200 hover:bg-neutral-800"}
		>
			{isActive(option) ? <option.ActiveIcon className="text-xl" /> : <option.Icon className="text-xl" />}
			<span className={clsx("text-lg", "hidden home-break:inline", isActive(option) && "font-bold")}>
				{option.label}
			</span>
		</Link>
	);
};

export const AppNav: React.FC = memo(function AppNav() {
	return (
		<nav
			className={clsx(
				"sticky top-10 flex select-none items-center justify-between gap-4 px-2 home-break-mobile:flex-col home-break-mobile:items-start",
				"home-break-mobile:justify-start home-break-mobile:gap-1 home-break-mobile:p-0 home-break:w-52",
			)}
		>
			{NAV_OPTIONS.map(option => (
				<div key={option.href}>
					<SignedIn>
						<Option {...{ ...option }} />
					</SignedIn>
					<SignedOut>
						<Option {...{ ...option, href: option.signedOutHref || option.href }} />
					</SignedOut>
				</div>
			))}

			<SignedIn>
				<Link
					href="/book/new"
					className={clsx(
						"flex items-center justify-center gap-3 rounded-2xl bg-main p-1 text-black duration-200",
						"hover:brightness-90 home-break-mobile:mt-4 home-break-mobile:w-full",
					)}
				>
					<span className="hidden home-break:inline">Postar</span>
					<IconTextPlus
						size={24}
						className="inline home-break:hidden"
					/>
				</Link>
			</SignedIn>
			<SignedOut>
				<Link
					href="/sign-in"
					className={clsx(
						"items-center justify-center gap-3 rounded-2xl bg-main p-1 text-black",
						"duration-200 hover:brightness-90 home-break-mobile:hidden",
					)}
				>
					<span className="hidden home-break:inline">Entrar</span>
					<IconLogin2
						size={24}
						className="inline home-break:hidden"
					/>
				</Link>
			</SignedOut>
		</nav>
	);
});
