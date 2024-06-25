function nextNode(node: Node | null) {
	if (node?.hasChildNodes()) {
		return node.firstChild;
	} else {
		while (node && !node.nextSibling) {
			node = node.parentNode;
		}
		if (!node) {
			return null;
		}
		return node.nextSibling;
	}
}

function getRangeSelectedNodes(range: Range) {
	let node: Node | null = range.startContainer;
	const endNode = range.endContainer;

	// Special case for a range that is contained within a single node
	if (node == endNode) {
		return [node];
	}

	// Iterate nodes until we hit the end container
	let rangeNodes = [];
	while (node && node != endNode) {
		rangeNodes.push((node = nextNode(node)));
	}

	// Add partially selected nodes at the start of the range
	node = range.startContainer;
	while (node && node != range.commonAncestorContainer) {
		rangeNodes.unshift(node);
		node = node.parentNode;
	}

	return rangeNodes;
}

function sanitizeText(text: string) {
	return text.replaceAll(/["'“”(){}\[\]-]/g, "");
}

export type Substrings = { [index: string]: { start: number; end: number } };

export function getSelectedNodes(text: string, range: Range): Substrings | undefined {
	const nodes = getRangeSelectedNodes(range).filter(node => !!node && node.nodeType === Node.TEXT_NODE) as Node[];
	const parentNodes = nodes.map(node => ({
		content: node.parentNode?.textContent || "",
		metadata: ((node.parentNode as HTMLSpanElement | null)?.dataset || undefined) as
			| { index: string; length: string; ignore?: string }
			| undefined,
	}));

	const words = text.trim().split(/\s/g);
	const substrings: Substrings = {};

	for (const node of parentNodes) {
		if (node.metadata?.ignore && node.metadata.ignore === "true") return undefined;
		if (!node.content || !node.metadata) continue;

		let added = 0;
		while (words[0] && node.content.includes(sanitizeText(words[0]))) {
			const start = substrings[node.metadata.index]?.start ?? node.content.indexOf(sanitizeText(words[0]));
			const end = substrings[node.metadata.index]?.end ?? start;
			substrings[node.metadata.index] = { start, end: end + words[0].length };
			words.shift();
			added++;
		}
		if (substrings[node.metadata.index]) substrings[node.metadata.index].end += added;
	}
	return substrings;
}
