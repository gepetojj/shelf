"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSwipeable } from "react-swipeable";

import { getURL } from "@/lib/url";
import { Loader } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { useSettings } from "./settings-context";

export type PDFViewerProps = {
	location: string;
	startPage?: number;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const documentOptions = {
	standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
	cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

const Placeholder: React.FC<{ height: number }> = ({ height }) => {
	return (
		<div
			className="flex items-center justify-center rounded-sm bg-main-foreground"
			style={{ height: `${height}px`, width: `${height * 0.66}px` }}
		/>
	);
};

export const PDFViewer: React.FC<PDFViewerProps> = memo(function PDFViewer({ location, startPage }) {
	const { currentPage, totalPages, progress, zoom, setCurrentPage, setTotalPages } = useSettings();
	const [loading, setLoading] = useState(0);
	const [availableHeight, setAvailableHeight] = useState(
		typeof document !== "undefined" ? window.screen.availHeight : 1000,
	);

	const calculateHeight = useCallback(() => {
		const totalHeight = window.screen.availHeight;
		const headerHeight = document.getElementById("reader-header")?.offsetHeight || 70;
		const contextHeight = document.getElementById("reader-context")?.offsetHeight || 20;
		const gap = 20;
		const result = totalHeight - (headerHeight + contextHeight + gap + 100);
		setAvailableHeight(result);
	}, []);

	useEffect(() => {
		calculateHeight();
		window.addEventListener("resize", calculateHeight, false);
		return () => window.removeEventListener("resize", calculateHeight);
	}, [calculateHeight]);

	const onLoadError = useCallback((error: Error) => {
		notifications.show({
			title: "Erro ao carregar o arquivo",
			message: `${error.message || "Houve um erro desconhecido"}. Clique no X para tentar novamente.`,
			color: "red",
			autoClose: false,
			onClose: () => window.location.reload(),
		});
	}, []);

	const onLoadProgress = useCallback(({ loaded, total }: { loaded: number; total: number }) => {
		total = Number.isNaN(total) ? loaded * 1.2 : total;
		const percentage = Math.round((loaded / total) * 100);
		setLoading(percentage);
	}, []);

	const onLoadSuccess = useCallback(
		(pdf: { numPages: number }) => {
			setTotalPages(pdf.numPages);
		},
		[setTotalPages],
	);

	const next = useCallback(() => {
		setCurrentPage(Math.min(currentPage + 1, totalPages));
	}, [currentPage, setCurrentPage, totalPages]);

	const prev = useCallback(() => {
		setCurrentPage(Math.max(currentPage - 1, 1));
	}, [currentPage, setCurrentPage]);

	const goTo = useCallback(
		(page: number) => {
			setCurrentPage(page);
		},
		[setCurrentPage],
	);

	useHotkeys([
		["ArrowLeft", prev],
		["ArrowRight", next],
	]);

	const swipeHandlers = useSwipeable({
		onSwipedLeft: next,
		onSwipedRight: prev,
		preventScrollOnSwipe: true,
	});

	useEffect(() => {
		if (typeof window === "undefined") return;
		const readerProgress = document.getElementById("reader-progress");
		const readerProgressCount = document.getElementById("reader-progress-count");
		if (readerProgress && readerProgressCount) {
			readerProgress.style.width = `${progress}%`;
			readerProgressCount.textContent = `${progress}%`;
		}
	}, [progress]);

	return (
		<>
			<button
				type="button"
				className={
					"hidden h-full w-[40%] items-center justify-center rounded-md p-1 duration-200" +
					"break-reader:static break-reader:flex break-reader:h-auto break-reader:w-auto break-reader:hover:bg-main-foreground"
				}
				onClick={prev}
			>
				<span className="sr-only">Botão para ir à página anterior</span>
				<IconChevronLeft
					size={30}
					className="hidden break-reader:inline"
					aria-hidden
				/>
			</button>
			<div
				{...swipeHandlers}
				className="h-full w-full max-w-[800px]"
				style={{ height: `${availableHeight}px` }}
			>
				<Document
					className="flex items-center justify-center"
					options={documentOptions}
					file={`${getURL()}/api/file?location=${location}`}
					externalLinkTarget="_blank"
					onItemClick={({ pageNumber }) => goTo(pageNumber)}
					onLoadError={onLoadError}
					onLoadProgress={onLoadProgress}
					onLoadSuccess={onLoadSuccess}
					onPassword={() =>
						onLoadError(new Error("O arquivo está protegido por senha. Peça ajuda ao suporte."))
					}
					loading={
						<div
							className="relative flex animate-pulse items-center justify-center rounded-sm bg-main-foreground"
							style={{ height: `${availableHeight}px`, width: `${availableHeight * 0.66}px` }}
						>
							<div
								className="absolute left-0 top-0 h-[5px] w-0 animate-progress-in rounded-xl bg-main duration-300"
								style={{ width: `${loading}%` }}
							/>
							<Loader
								size={50}
								color="main"
								type="dots"
							/>
						</div>
					}
					noData={<Placeholder height={availableHeight} />}
					error={<Placeholder height={availableHeight} />}
				>
					{currentPage - 1 > 0 && (
						<Page
							pageNumber={currentPage - 1}
							className="hidden"
						/>
					)}
					<Page
						pageNumber={currentPage}
						height={availableHeight}
						scale={zoom}
						loading={
							<div
								className="bg-white"
								style={{
									height: `${availableHeight}px`,
									width: `${availableHeight * 0.66}px`,
								}}
							/>
						}
						noData={<Placeholder height={availableHeight} />}
						error={<Placeholder height={availableHeight} />}
					/>
					{currentPage + 1 <= totalPages && (
						<Page
							pageNumber={currentPage + 1}
							className="hidden"
						/>
					)}
				</Document>
			</div>
			<button
				type="button"
				className={
					"hidden h-full w-[40%] items-center justify-center rounded-md p-1 duration-200" +
					"break-reader:static break-reader:flex break-reader:h-auto break-reader:w-auto break-reader:hover:bg-main-foreground"
				}
				onClick={next}
			>
				<span className="sr-only">Botão para ir à página seguinte</span>
				<IconChevronRight
					size={30}
					className="hidden break-reader:inline"
					aria-hidden
				/>
			</button>
		</>
	);
});
