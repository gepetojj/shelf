import { AppHeader } from "@/components/ui/app-header";
import { AppNav } from "@/components/ui/app-nav";
import { Layout } from "@/components/ui/layout";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@mantine/core";
import { IconLogin2, IconUnlink } from "@tabler/icons-react";

export default async function NotFound() {
	return (
		<section className="flex h-full min-h-screen w-full gap-4 py-10">
			{/* Navegação para telas maiores */}
			<aside className="sticky hidden w-full max-w-[8rem] flex-col items-end justify-between home-break-mobile:flex home-break:w-[30%] home-break:max-w-full">
				<AppNav />
				<div className="sticky bottom-10 flex w-full max-w-56 select-none justify-end home-break:w-52">
					<SignedIn>
						<UserButton
							showName
							appearance={{
								elements: {
									rootBox: "w-full flex justify-end",
									userButtonBox: "flex items-center justify-end w-full flex-row-reverse",
									userButtonOuterIdentifier:
										"hidden home-break:inline text-white !text-base font-nunito-sans truncate",
									userButtonTrigger:
										"rounded-3xl shadow-sm px-4 py-1.5 duration-200 hover:bg-neutral-800 home-break:w-full",
								},
							}}
						/>
					</SignedIn>
					<SignedOut>
						<SignInButton mode="modal">
							<div className="flex w-full justify-end">
								<div className="hidden w-full home-break:inline">
									<Button
										className="min-w-full shadow-sm"
										radius="xl"
										rightSection={<IconLogin2 size={20} />}
									>
										Entre já
									</Button>
								</div>
								<div className="home-break:hidden">
									<Button radius="xl">
										<IconLogin2 size={20} />
									</Button>
								</div>
							</div>
						</SignInButton>
					</SignedOut>
				</div>
			</aside>

			{/* Navegação para telas menores */}
			<div className="fixed bottom-0 z-10 inline w-full border-t border-t-white/10 bg-main-foreground p-2 animate-in slide-in-from-bottom-2 home-break-mobile:hidden">
				<AppNav />
			</div>

			<main className="flex w-full px-4 home-break:px-0">
				<Layout>
					<>
						<AppHeader />
						<div className="flex w-full flex-col items-center justify-center gap-7 py-10">
							<IconUnlink size={52} />
							<div className="flex w-full flex-col gap-2">
								<h1 className="text-center text-2xl font-semibold">Essa página não foi encontrada</h1>
								<span className="text-center text-neutral-300">
									Verifique a digitação e tente novamente.
								</span>
							</div>
						</div>
					</>
					<></>
				</Layout>
			</main>
		</section>
	);
}
