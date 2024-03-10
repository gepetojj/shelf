"use client";

import clsx from "clsx/lite";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import {
	MdBookmark,
	MdBookmarkBorder,
	MdHome,
	MdNotifications,
	MdNotificationsNone,
	MdOutlineHome,
	MdPostAdd,
} from "react-icons/md";

export const NavActions: React.FC = memo(function Component() {
	const pathname = usePathname();
	const NavClasses = "flex w-fit items-center gap-3 rounded-3xl p-2 px-4 duration-200 hover:bg-neutral-800";

	return (
		<div
			className="sticky top-10 flex 
			select-none items-center justify-between gap-4 px-2 home-break-mobile:flex-col home-break-mobile:items-start home-break-mobile:justify-start home-break-mobile:gap-1 home-break-mobile:p-0 home-break:w-52"
		>
			<Link
				href="/app"
				className={NavClasses}
			>
				{pathname === "/app" ? <MdHome className="text-2xl" /> : <MdOutlineHome className="text-2xl" />}
				<span className={clsx("text-lg", "hidden home-break:inline", pathname === "/app" && "font-bold")}>
					Página inicial
				</span>
			</Link>
			<Link
				href="/app/notifications"
				className={NavClasses}
			>
				{pathname === "/app/notifications" ? (
					<MdNotifications className="text-2xl" />
				) : (
					<MdNotificationsNone className="text-2xl" />
				)}
				<span
					className={clsx(
						"text-lg",
						"hidden home-break:inline",
						pathname === "/app/notifications" && "font-bold",
					)}
				>
					Notificações
				</span>
			</Link>
			<Link
				href="/app/shelf"
				className={NavClasses}
			>
				{pathname === "/app/shelf" ? (
					<MdBookmark className="text-2xl" />
				) : (
					<MdBookmarkBorder className="text-2xl" />
				)}
				<span className={clsx("text-lg", "hidden home-break:inline", pathname === "/app/shelf" && "font-bold")}>
					Sua estante
				</span>
			</Link>
			<Link
				href="/app/new"
				className="flex items-center justify-center gap-3 rounded-2xl bg-main p-1 text-black
				duration-200 hover:brightness-90 home-break-mobile:mt-4 home-break-mobile:w-full"
			>
				<span className="hidden home-break:inline">Postar</span>
				<MdPostAdd className="inline text-2xl home-break:hidden" />
			</Link>
		</div>
	);
});
