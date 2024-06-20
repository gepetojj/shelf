"use client";

import { memo, useCallback } from "react";

import { api } from "@/trpc/react";
import { ActionIcon, Divider, Drawer, NumberInput, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconExternalLink, IconMenu, IconTrash } from "@tabler/icons-react";

import { useSettings } from "./settings-context";

export const Settings: React.FC = memo(function Settings({}) {
	const { currentPage, totalPages, zoom, annotations, setCurrentPage, setZoom } = useSettings();
	const [opened, { toggle, close }] = useDisclosure(false);
	const deleteAnnotation = api.fileAnnotations.delete.useMutation();

	const onDeleteAnnotation = useCallback(
		(id: string) => {
			deleteAnnotation.mutate(
				{ id },
				{
					onError: error => {
						notifications.show({
							title: "Erro ao deletar anotação",
							message: error.message || "Houve um erro desconhecido.",
							color: "red",
						});
					},
				},
			);
		},
		[deleteAnnotation],
	);

	return (
		<>
			<button
				className="rounded-md bg-main p-1 text-black"
				onClick={toggle}
			>
				<span className="sr-only">Botão para abrir as opções de leitura.</span>
				<IconMenu
					size={20}
					aria-hidden="true"
				/>
			</button>

			<Drawer
				opened={opened}
				onClose={close}
				title="Leitura"
			>
				<Stack gap={10}>
					<NumberInput
						label="Altere a página:"
						description="Escolha a página que deseja ler."
						value={currentPage}
						min={1}
						minLength={1}
						max={totalPages}
						maxLength={totalPages.toString().length}
						onChange={value => {
							const page = Number(value);
							if (page < 1 || page > totalPages) return;
							setCurrentPage(page);
						}}
						stepHoldDelay={500}
						stepHoldInterval={100}
						allowDecimal={false}
						allowNegative={false}
					/>

					<NumberInput
						label="Altere o zoom:"
						description="Mínimo de 100 e máximo de 125."
						value={zoom * 100}
						min={100}
						minLength={3}
						max={125}
						maxLength={3}
						onChange={value => {
							const z = Number(value) / 100;
							if (z < 1 || z > 1.25) return;
							setZoom(z);
						}}
						stepHoldDelay={500}
						stepHoldInterval={100}
						allowNegative={false}
						step={1}
					/>

					<div className="pt-4">
						<Text
							size="sm"
							className="pb-1"
						>
							Anotações:
						</Text>
						<div className="flex h-fit w-full flex-col overflow-y-auto">
							<Stack>
								<Text
									size="xs"
									className="text-neutral-300"
								>
									Da página atual
								</Text>
								<ul className="flex flex-col gap-4">
									{annotations
										.filter(a => a.page === currentPage && a.comment)
										.map(a => (
											<li
												key={a.id}
												className="flex flex-col gap-1 duration-200 animate-in fade-in-20"
											>
												<header className="flex w-full items-center justify-between">
													<span className="truncate text-sm text-neutral-200">
														&quot;{a.textContent}&quot;
													</span>
													<ActionIcon
														variant="subtle"
														onClick={() => onDeleteAnnotation(a.id)}
														color="red"
													>
														<IconTrash size={14} />
													</ActionIcon>
												</header>
												<div className="h-fit w-full break-words">
													<p className="break-words text-justify text-sm">{a.comment}</p>
												</div>
											</li>
										))}
								</ul>
							</Stack>
							<Divider className="my-2" />
							<Stack>
								<Text
									size="xs"
									className="text-neutral-300"
								>
									Todas nesse documento
								</Text>
								<ul className="flex flex-col gap-4">
									{annotations
										.filter(a => a.page !== currentPage && a.comment)
										.map(a => (
											<li
												key={a.id}
												className="flex flex-col gap-1 duration-200 animate-in fade-in-20"
											>
												<header className="flex w-full items-center justify-between">
													<div className="flex max-w-[70%] items-center gap-2">
														<span className="max-w-[60%] truncate text-sm text-neutral-200">
															&quot;{a.textContent}&quot;
														</span>
														<span className="text-xs text-neutral-400">
															Página {a.page}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<ActionIcon
															variant="subtle"
															onClick={() => setCurrentPage(a.page)}
														>
															<IconExternalLink size={14} />
														</ActionIcon>
														<ActionIcon
															variant="subtle"
															onClick={() => onDeleteAnnotation(a.id)}
															color="red"
														>
															<IconTrash size={14} />
														</ActionIcon>
													</div>
												</header>
												<div className="h-fit w-full break-words">
													<p className="break-words text-justify text-sm">{a.comment}</p>
												</div>
											</li>
										))}
								</ul>
							</Stack>
						</div>
					</div>
				</Stack>
			</Drawer>
		</>
	);
});
