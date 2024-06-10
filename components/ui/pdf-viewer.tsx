"use client";

import type { PDFDocumentProxy } from "pdfjs-dist/types/src/pdf";
import { memo, useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { getURL } from "@/lib/url";
import { Loader } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

export type PDFViewerProps = {
	location: string;
	startPage?: number;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PDFViewer: React.FC<PDFViewerProps> = memo(function PDFViewer({ location, startPage }) {
	const [pages, setPages] = useState(0);
	const [current, setCurrent] = useState(startPage || 1);
	const [loading, setLoading] = useState(0);
	const [availableHeight, setAvailableHeight] = useState(
		typeof document !== "undefined" ? document.body.offsetHeight : 1000,
	);

	const calculateHeight = useCallback(() => {
		const totalHeight = document.body.offsetHeight;
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

	const onLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
		setPages(pdf.numPages);
	}, []);

	const next = useCallback(() => {
		setCurrent(prev => Math.min(prev + 1, pages));
	}, [pages]);

	const prev = useCallback(() => {
		setCurrent(prev => Math.max(prev - 1, 1));
	}, []);

	useHotkeys([
		["ArrowLeft", prev],
		["ArrowRight", next],
	]);

	return (
		<div
			className="h-full w-full max-w-[800px]"
			style={{ height: `${availableHeight}px` }}
		>
			<Document
				file={`${getURL()}/api/file?location=${location}`}
				externalLinkTarget="_blank"
				onLoadError={onLoadError}
				onLoadProgress={onLoadProgress}
				onLoadSuccess={onLoadSuccess}
				onPassword={() => onLoadError(new Error("O arquivo está protegido por senha. Peça ajuda ao suporte."))}
				loading={
					<div className="relative flex h-[1200px] w-[800px] animate-pulse items-center justify-center rounded-sm bg-main-foreground">
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
				noData={
					<div className="flex h-[1200px] w-[800px] items-center justify-center rounded-sm bg-main-foreground" />
				}
				error={
					<div className="flex h-[1200px] w-[800px] items-center justify-center rounded-sm bg-main-foreground" />
				}
			>
				<Page
					pageNumber={current}
					height={availableHeight}
					className="flex items-center justify-center"
				/>
			</Document>
		</div>
	);
});
