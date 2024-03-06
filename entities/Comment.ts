export interface Comment {
	id: string;
	bookId: string;
	content: string;
	creator: {
		id: string;
		name: string;
		iconUrl: string;
	};
	createdAt: number;
}
