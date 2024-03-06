import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/models/auth";
import logo from "@/public/logo.svg";

import { LoginButton } from "./_components/LoginButton";

export default async function Page() {
	const session = await getServerSession(auth);
	if (session) return redirect("/app");

	return (
		<main className="flex h-full min-h-screen items-center justify-center">
			<div className="flex h-fit w-full max-w-sm flex-col gap-6">
				<header>
					<Image
						src={logo}
						alt="Logo do Shelf. Descrição: Ícone amarelo formado por círculos e retângulos desenhando a letra 'S', ao lado esquerdo do texto escrito 'Shelf.'."
						className="max-w-[110px]"
					/>
				</header>
				<div className="flex flex-col gap-3">
					<p>Faça login para acessar a plataforma.</p>
					<p>
						Seus dados são utilizados apenas para identificação e armazenamento das suas leituras e
						comentários.
					</p>
				</div>
				<LoginButton />
			</div>
		</main>
	);
}
