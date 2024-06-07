export interface BookApiItem {
	id: string;
	volumeInfo: {
		title: string;
		subtitle: string;
		authors: string[];
		publisher: string;
		description: string;
		pageCount: number;
		industryIdentifiers?: { type: string; identifier: string }[];
		imageLinks?: {
			smallThumbnail: string;
			thumbnail: string;
		};
	};
}

export interface BooksApiResponse {
	items: BookApiItem[];
}

export const queryBooks = async (query: string): Promise<BookApiItem[]> => {
	const endpoint = "https://www.googleapis.com/books/v1/volumes";
	const params = new URLSearchParams({
		q: query,
		maxResults: "3",
		orderBy: "relevance",
		filter: "ebooks",
	}).toString();

	const response = await fetch(`${endpoint}?${params}`);
	const { items } = (await response.json()) as BooksApiResponse;
	return items;
};
