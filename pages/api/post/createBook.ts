import type { Session } from "next-auth";
import { z } from "zod";

import type { Book } from "@/entities/Book";
import { now } from "@/lib/time";

import { schema } from ".";

export interface CreateBookProps {
	data: z.infer<typeof schema>;
	user: Session["user"];
}

export const createBook = ({ data, user }: CreateBookProps): Omit<Book, "files"> => {
	const book = data.book;

	const isbn13 = book.volumeInfo.industryIdentifiers.find(val => val.type === "ISBN_13");
	const isbn10 = book.volumeInfo.industryIdentifiers.find(val => val.type === "ISBN_10");
	const largeThumbnail = new URL(book.volumeInfo.imageLinks?.thumbnail || "");
	largeThumbnail.searchParams.set("zoom", "2");

	const info: Omit<Book, "files"> = {
		id: crypto.randomUUID(),
		title: book.volumeInfo.title,
		subtitle: book.volumeInfo.subtitle || null,
		authors: book.volumeInfo.authors,
		description: book.volumeInfo.description || "",
		publishers: [book.volumeInfo.publisher],
		pages: book.volumeInfo.pageCount || 0,
		isbn10: isbn10?.identifier || "",
		isbn13: isbn13?.identifier || "",
		semester: data.semester,
		thumbnail: {
			small: book.volumeInfo.imageLinks?.thumbnail || "",
			large: book.volumeInfo.imageLinks?.thumbnail ? largeThumbnail.toString() : "",
		},
		disciplines: data.disciplines,
		topics: data.topics,
		uploader: {
			id: user?.id || "",
			name: user?.name || "",
			iconUrl: user?.image || "",
		},
		uploadedAt: now(),
	};

	return info;
};
