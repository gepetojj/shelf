export interface File {
	id: string;
	bookId: string;
	name: string;
	fullname: string;
	mime: string;
	size: number;
	location: string;
	meta: {
		uploadedBy: string;
		uploadedAt: number;
		originalName: string;
		originalMime: string;
		originalSize: number;
	};
}
