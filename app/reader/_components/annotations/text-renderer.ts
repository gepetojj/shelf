import { FileAnnotationProps } from "@/core/domain/entities/file-annotation";

export const generateText = (value: string, index: number) => {
	const element = document.createElement("span");
	element.innerText = value;
	element.dataset.index = index.toString();
	element.dataset.length = value.length.toString();
	return element;
};

export const generateHighlight = (value: string, index: number, substring: { start: number; end: number }) => {
	const element = generateText(value, index);
	const highlight = document.createElement("span");
	highlight.classList.add("reader-highlight");
	highlight.innerText = value.substring(substring.start, substring.end);
	element.innerHTML = element.innerHTML.replace(value.substring(substring.start, substring.end), highlight.outerHTML);
	return element.outerHTML;
};

export const generateAnnotation = (value: string, index: number, substring: { start: number; end: number }) => {
	const element = generateText(value, index);
	const highlight = document.createElement("span");
	highlight.classList.add("reader-annotation");
	highlight.innerText = value.substring(substring.start, substring.end);
	element.innerHTML = element.innerHTML.replace(value.substring(substring.start, substring.end), highlight.outerHTML);
	return element.outerHTML;
};

export const textRenderer = (annotations: FileAnnotationProps[]) => {
	return ({ str, itemIndex }: { str: string; itemIndex: number }) => {
		const annotation = annotations.find(annotation => !!annotation.substrings[itemIndex]);
		if (!annotation) return generateText(str, itemIndex).outerHTML;

		const substring = annotation.substrings[itemIndex];

		if (annotation.comment) return generateAnnotation(str, itemIndex, substring);
		return generateHighlight(str, itemIndex, substring);
	};
};
