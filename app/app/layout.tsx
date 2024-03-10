import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/models/auth";

import { Logout } from "./_components/Logout";
import { NavActions } from "./_components/NavActions";

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(auth);
	if (!session || !session.user) return redirect("/");

	return (
		<section className="flex h-full min-h-screen w-full gap-4 py-10">
			<aside className="sticky hidden w-full max-w-[8rem] flex-col items-end justify-between home-break-mobile:flex home-break:w-[30%] home-break:max-w-full">
				<NavActions />
				<div className="sticky bottom-10 flex w-full max-w-56 select-none justify-end">
					<div className="flex w-fit items-center justify-end gap-2 rounded-3xl p-2 px-4 duration-200 hover:bg-neutral-800 home-break:w-full home-break:justify-between home-break:px-2">
						<div className="hidden w-full items-center gap-2 home-break:flex">
							<Image
								alt="Imagem do usuário, vinda da conta Google vinculada."
								src={session.user.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
								width={34}
								height={34}
								className="rounded-full"
							/>
							<span className="truncate font-light">
								{session.user.name?.split(" ").slice(0, 2).join(" ") || "Usuário"}
							</span>
						</div>
						<Logout />
					</div>
				</div>
			</aside>

			<div
				className="fixed bottom-0 z-10 inline w-full border-t border-t-white/10 
				bg-main-foreground p-2 animate-in slide-in-from-bottom-2 home-break-mobile:hidden"
			>
				<NavActions />
			</div>

			<main className="flex w-full px-4 home-break:px-0">{children}</main>
		</section>
	);
}
