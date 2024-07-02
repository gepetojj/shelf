import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";
import { api } from "@/server/trpc/server";
import { IconArchiveOff, IconSteam } from "@tabler/icons-react";

export default async function Page() {
	const notifications = await api.notifications.list();

	return (
		<>
			<Layout>
				<>
					<AppHeader />
					<div className="flex flex-col px-4 py-4 pb-10 sm:px-12">
						<h1 className="text-2xl font-bold">Notificações</h1>
						{notifications.length > 0 ? (
							<ul className="flex w-full flex-col gap-4 py-6">
								{notifications.map(notification => (
									<li
										key={notification.id}
										className="flex gap-6 rounded-md bg-main-foreground px-4 py-3 shadow-sm"
									>
										<div className="flex h-full items-center justify-center">
											<IconSteam size={24} />
										</div>
										<div className="flex w-full flex-col">
											<h2 className="font-medium">{notification.title}</h2>
											<p className="text-justify text-sm text-neutral-200">
												{notification.textContent}
											</p>
											<div className="flex w-full items-center justify-end pt-2">
												<span className="text-right text-xs text-neutral-400">
													Recebida em{" "}
													{new Date(notification.createdAt).toLocaleString("pt-BR")}
												</span>
											</div>
										</div>
									</li>
								))}
							</ul>
						) : (
							<div className="flex w-full flex-col items-center justify-center gap-2 px-2 py-10">
								<IconArchiveOff size={48} />
								<span className="text-lg">Não há notificações ainda.</span>
							</div>
						)}
					</div>
				</>
				<></>
			</Layout>
		</>
	);
}
