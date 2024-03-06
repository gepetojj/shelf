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
		<section className="flex h-full min-h-screen w-full py-10">
			<aside className="sticky flex w-[30%] flex-col items-end justify-between">
				<NavActions />
				<div className="sticky bottom-10 w-full max-w-56 select-none">
					<div className="flex w-full items-center justify-between gap-2 rounded-3xl p-2 duration-200 hover:bg-neutral-800">
						<div className="flex w-full items-center gap-2">
							<Image
								alt="Imagem do usuário, vinda da conta Google vinculada."
								src={session.user.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
								width={34}
								height={34}
								className="rounded-full"
							/>
							<span className="font-light">
								{session.user.name?.split(" ").slice(0, 2).join(" ") || "Usuário"}
							</span>
						</div>
						<Logout />
					</div>
				</div>
			</aside>
			<main className="flex w-full">{children}</main>
		</section>
	);
}
