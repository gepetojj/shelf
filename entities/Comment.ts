export interface Comment {
	id: string;
	bookId: string;
	parentId: string;
	content: string;
	creator: {
		id: string;
		name: string;
		iconUrl: string;
	};
	createdAt: number;
}
