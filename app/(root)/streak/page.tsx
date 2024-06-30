import clsx from "clsx/lite";

import { IconFlameFilled } from "@/components/icons/flame-filled";
import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";
import { removeTime } from "@/lib/time";
import { api } from "@/trpc/server";

export default async function Page() {
	const { sequence, streak } = await api.endurance.list();

	sequence.map(day => new Date(day.toISOString()));
	const sequenceInTimestamp = sequence.map(date => date.valueOf());

	return (
		<>
			<Layout>
				<>
					<AppHeader />
					<div className="flex flex-col gap-4 p-4 pb-10 sm:px-12">
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
					</div>
				</>
				<></>
			</Layout>
		</>
	);
}
