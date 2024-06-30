import clsx from "clsx/lite";

import { IconFlameFilled } from "@/components/icons/flame-filled";
import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";
import { removeTime } from "@/lib/time";
import { api } from "@/server/trpc/server";
import { IconMoodSad, IconMoodTongueWink2, IconTrophy } from "@tabler/icons-react";

export default async function Page() {
	const [{ sequence, streak }, { achieved, toAchieve }] = await Promise.all([
		api.endurance.list(),
		api.achievements.list(),
	]);

	sequence.map(day => new Date(day.toISOString()));
	const sequenceInTimestamp = sequence.map(date => date.valueOf());

	return (
		<>
			<Layout>
				<>
					<AppHeader />
					<div className="flex flex-col gap-8 p-4 pb-10 sm:px-12">
						<div className="flex w-full flex-col gap-6 rounded bg-main-foreground px-6 py-4">
							<div className="flex w-full items-center justify-between gap-6">
								<div className="flex max-w-[65%] flex-col gap-2">
									<h1
										className={clsx(
											"text-2xl font-bold",
											streak <= 0 ? "text-neutral-500" : "text-gradient-flame",
										)}
									>
										{streak} {streak === 1 ? "dia" : "dias"} em sequência
									</h1>
									<h2 className="text-neutral-200">
										{streak <= 0
											? "Leia ao menos uma página hoje para iniciar uma nova sequência!"
											: "Continue lendo todos os dias para manter sua sequência!"}
									</h2>
								</div>
								<div className="flex h-full items-center justify-center">
									<IconFlameFilled
										size={64}
										className={clsx(streak <= 0 ? "text-neutral-500" : "text-[#f99806]")}
										fill={streak <= 0 ? "currentColor" : "#fbbf24"}
									/>
								</div>
							</div>

							<div className="flex w-full justify-evenly rounded bg-neutral-900 p-4 font-bold">
								{["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => {
									const date = new Date();
									const offset = index - new Date().getDay();
									date.setDate(new Date().getDate() + offset);
									const isDayPartOfStreak = sequenceInTimestamp.includes(removeTime(date).valueOf());

									return (
										<div
											key={`streak-week-day-${day}`}
											className="flex flex-col items-center justify-center gap-1"
										>
											<span className={clsx(new Date().getDay() === index && "text-[#ffcb74]")}>
												{day}
											</span>
											<div
												className={clsx(
													"h-[28px] w-[28px] rounded-full",
													isDayPartOfStreak ? "bg-[#ffcb74]" : "bg-neutral-700",
												)}
											/>
										</div>
									);
								})}
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<h2 className="text-2xl font-bold">Conquistas</h2>
							<ul className="flex flex-col gap-2">
								{achieved.length > 0 ? (
									achieved.map(av => (
										<li
											key={`achievement-${av.code}`}
											className="flex items-center gap-4 p-4"
										>
											<div>
												<IconTrophy size={36} />
											</div>
											<div>
												<h3 className="text-lg font-medium text-neutral-100">{av.name}</h3>
												<p className="text-neutral-200">{av.description}</p>
											</div>
										</li>
									))
								) : (
									<li className="flex w-full flex-col items-center justify-center gap-2 py-4">
										<IconMoodSad size={48} />
										<div className="flex flex-col items-center justify-center text-center">
											<span className="text-neutral-100">
												Você ainda não completou nenhuma conquista
											</span>
											<span className="text-sm text-neutral-200">
												Continue lendo para desbloquear novas aventuras!
											</span>
										</div>
									</li>
								)}
							</ul>
							<div className="flex flex-col gap-2 pt-4">
								<h3 className="text-sm font-light text-neutral-300">Ainda disponíveis</h3>
								{toAchieve.length > 0 ? (
									toAchieve.map(av => (
										<div
											key={`locked-achievement-${av.code}`}
											className="flex items-center justify-between gap-4 p-4"
										>
											<div>
												<h3 className="text-lg font-medium text-neutral-300">{av.name}</h3>
												<p className="text-neutral-400">{av.description}</p>
											</div>
										</div>
									))
								) : (
									<div className="flex w-full flex-col items-center justify-center gap-2 py-4">
										<IconMoodTongueWink2 size={48} />
										<div className="flex flex-col items-center justify-center text-center">
											<span className="text-neutral-100">
												Você já completou todos os desafios até agora!
											</span>
											<span className="text-sm text-neutral-200">
												Fique ligado(a) nas próximas novidades
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</>
				<></>
			</Layout>
		</>
	);
}
