import type { File } from "./File";

export interface Book {
	id: string;
	title: string;
	subtitle: string | null;
	authors: string[];
	description: string;
	publishers: string[];
	pages: number;
	isbn10: string;
	isbn13: string;
	semester: number;
	thumbnail: {
		small: string;
		large: string;
	};
	disciplines: string[];
	topics: string[];
	files: File[];

	uploader: {
		id: string;
		name: string;
		iconUrl: string;
	};
	uploadedAt: number;
}
