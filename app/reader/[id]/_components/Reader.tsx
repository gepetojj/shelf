"use client";

import { memo, useCallback, useEffect, useState, useTransition } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

import type { Book } from "@/entities/Book";
import { useHotkeys } from "@mantine/hooks";
import ePub from "@parkdoeui/epubjs";

export interface ReaderProps {
	book: Book;
	location?: string;
}

export const Reader: React.FC<ReaderProps> = memo(function Component({ book, location }) {
	const [epub, setEpub] = useState<ePub.Book | undefined>(undefined);
	const [_loading, startLoading] = useTransition();
	useHotkeys([
		["ArrowLeft", () => previousPage()],
		["ArrowRight", () => nextPage()],
	]);

	const getHeight = useCallback(() => {
		if (typeof document === "undefined") return;
		const header = document.getElementById("reader-header");
		const context = document.getElementById("reader-context");
		if (!header || !context) return;

		const gap = 20 + 12;
		const deadZone = header.offsetHeight + context.offsetHeight;
		const readerZone = document.body.offsetHeight - deadZone - gap;
		return readerZone;
	}, []);

	const createBook = useCallback(async () => {
		const epub = ePub(book.files[0].location);
		const rendition = epub.renderTo("reader", { height: getHeight(), width: "100%" });
		await rendition.display(location);
		setEpub(epub);
		console.log(epub);

		rendition.themes.register({
			sepia: { body: { "background-color": "#FFF7E0", "color": "#000" } },
			light: { body: { "background-color": "#FFF", "color": "#000" } },
			dark: { "body": { "background-color": "#090909", "color": "#B9B9B9" }, "a:link": { color: "#6666F3" } },
		});
		rendition.themes.select(JSON.parse(localStorage.getItem("reader-settings") || "{}")?.theme || "sepia");

		const reader = document.getElementById("reader");
		if (!reader) return;
		if (reader.children.length > 1) reader.firstChild?.remove();

		setTimeout(() => {
			rendition.start();
		}, 200);
	}, [book.files, getHeight, location]);

	const updateProgress = useCallback(() => {
		if (!epub) return;
		const locationInfo = epub.rendition.currentLocation() as any;
		const location = locationInfo.start.cfi;
		fetch("/api/progress", { method: "POST", body: JSON.stringify({ bookId: book.id, progress: "0%", location }) });
	}, [book.id, epub]);

	const previousPage = useCallback(async () => {
		if (!epub) return;
		await epub.rendition.prev();
		updateProgress();
	}, [epub, updateProgress]);

	const nextPage = useCallback(async () => {
		if (!epub) return;
		await epub.rendition.next();
		updateProgress();
	}, [epub, updateProgress]);

	useEffect(() => {
		if (typeof document === "undefined") return;
		startLoading(() => {
			createBook();
		});
	}, [createBook]);

	useEffect(() => {
		const listener = () => {
			const string = localStorage.getItem("reader-settings");
			if (!string || !epub) return;
			const json = JSON.parse(string);
			if (!json.theme) return;
			epub.rendition.themes.select(json.theme);
		};

		window.addEventListener("settings-changed", listener);
		return () => window.removeEventListener("settings-changed", listener);
	}, [epub]);

	return (
		<>
			<button
				className="fixed left-0 z-10 
				flex h-full w-[40%] items-center justify-center rounded-md p-1 duration-200 break-reader:static break-reader:h-auto break-reader:w-auto break-reader:hover:bg-main-foreground"
				onClick={previousPage}
			>
				<span className="sr-only">Botão para ir à página anterior</span>
				<MdArrowLeft
					className="hidden text-3xl break-reader:inline"
					aria-hidden
				/>
			</button>
			<div
				id="reader"
				className="h-full w-full max-w-[38rem]"
			></div>
			<button
				className="fixed right-0 z-10 
				flex h-full w-[40%] items-center justify-center rounded-md p-1 duration-200 break-reader:static break-reader:h-auto break-reader:w-auto break-reader:hover:bg-main-foreground"
				onClick={nextPage}
			>
				<span className="sr-only">Botão para ir à página seguinte</span>
				<MdArrowRight
					className="hidden text-3xl break-reader:inline"
					aria-hidden
				/>
			</button>
		</>
	);
});
