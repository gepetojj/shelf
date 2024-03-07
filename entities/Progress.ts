export interface Progress {
	id: string; // User ID
	books: { [bookId: string]: { progress: string; location: string } };
}
