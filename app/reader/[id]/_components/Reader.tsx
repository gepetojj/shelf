"use client";

import ePub from "epubjs";
import { memo, useCallback, useEffect, useState } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

import type { Book } from "@/entities/Book";

export interface ReaderProps {
	book: Book;
	location?: string;
}

export const Reader: React.FC<ReaderProps> = memo(function Component({ book, location }) {
	const [epub, setEpub] = useState<ePub.Book | undefined>(undefined);

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

		const reader = document.getElementById("reader");
		if (!reader) return;
		if (reader.children.length > 1) reader.firstChild?.remove();

		rendition.themes.register({
			sepia: { body: { "background-color": "#FFF7E0", "color": "#000" } },
			light: { body: { "background-color": "#FFF", "color": "#000" } },
			dark: { "body": { "background-color": "#090909", "color": "#B9B9B9" }, "a:link": { color: "#6666F3" } },
		});
		rendition.themes.select(JSON.parse(localStorage.getItem("reader-settings") || "{}")?.theme || "sepia");
	}, [book.files, getHeight, location]);

	const updateProgress = useCallback(() => {
		if (!epub) return;

		const progress = ((epub.rendition.location.end.index * 100) / epub.navigation.toc.length - 2).toFixed(1) + "%";
		const bar = document.getElementById("reader-progress");
		if (bar) bar.style.width = progress;
		const count = document.getElementById("reader-progress-count");
		if (count) count.innerText = progress;

		const locationInfo = epub.rendition.currentLocation() as any;
		const location = locationInfo.end.cfi;

		fetch("/api/progress", { method: "POST", body: JSON.stringify({ bookId: book.id, progress, location }) });
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
		createBook();
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
				className="flex items-center justify-center rounded-md p-1 duration-200 hover:bg-main-foreground"
				onClick={previousPage}
			>
				<MdArrowLeft className="text-3xl" />
			</button>
			<div
				id="reader"
				className="h-full w-full max-w-[38rem]"
			></div>
			<button
				className="flex items-center justify-center rounded-md p-1 duration-200 hover:bg-main-foreground"
				onClick={nextPage}
			>
				<MdArrowRight className="text-3xl" />
			</button>
		</>
	);
});
