import type { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";

import { FileExternal } from "@/core/domain/entities/file-external";
import { FileExternalGateway } from "@/core/domain/gateways/file-external.gateway";
import { ResourceNotFound, UnknownError } from "@/errors/infra";

import { Registry } from "../container/registry";

interface GoogleBooksApiDTO {
	items: {
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
	}[];
}

@injectable()
export class GoogleBooksGateway implements FileExternalGateway {
	private http: AxiosInstance;
	private logger: Console;
	private endpoint = "https://www.googleapis.com/books/v1/volumes";

	constructor(@inject(Registry.Http) http: AxiosInstance, @inject(Registry.Logger) logger: Console) {
		this.http = http;
		this.logger = logger;
	}

	async findOne(query: string): Promise<FileExternal> {
		try {
			const books = await this.findRelevant(query, 1);
			return books[0];
		} catch (err: any) {
			if (err instanceof ResourceNotFound) throw err;
			this.logger.error("Failed to fetch google books api", {
				err: err.message || err.stack || err,
				query,
			});
			throw new UnknownError({
				message: "Erro ao buscar livro no Google.",
				location: "gateways:google_books:find_one",
				context: { query },
			});
		}
	}

	async findRelevant(query: string): Promise<FileExternal[]>;
	async findRelevant(query: string, max: number): Promise<FileExternal[]>;
	async findRelevant(query: string, max?: number): Promise<FileExternal[]> {
		const params = new URLSearchParams({
			q: query,
			maxResults: max?.toString() || "5",
			orderBy: "relevance",
			filter: "ebooks",
		}).toString();

		try {
			const result = await this.http.get<GoogleBooksApiDTO>(new URL("?" + params, this.endpoint).toString(), {
				withCredentials: false,
			});
			if (!result.data.items.length) {
				throw new ResourceNotFound({ location: "gateways:google_books:find_relevant" });
			}
			const data = result.data.items.map(val => {
				const largeThumbnail = new URL(val.volumeInfo.imageLinks?.thumbnail || "");
				if (val.volumeInfo.imageLinks?.thumbnail) largeThumbnail.searchParams.set("zoom", "2");
				return FileExternal.fromJSON({
					title: val.volumeInfo.title,
					subtitle: val.volumeInfo.subtitle,
					description: val.volumeInfo.description,
					authors: val.volumeInfo.authors || [],
					publishers: [val.volumeInfo.publisher],
					pages: val.volumeInfo.pageCount,
					globalIdentifier: val.volumeInfo.industryIdentifiers?.[0].identifier || null,
					thumbnailUrl: val.volumeInfo.imageLinks?.thumbnail || null,
					thumbnailAltUrl: largeThumbnail.toString() || null,
				});
			});
			return data;
		} catch (err: any) {
			if (err instanceof ResourceNotFound) throw err;
			this.logger.error("Failed to fetch google books api", {
				err: err.message || err.stack || err,
				query,
			});
			throw new UnknownError({
				message: "Erro ao buscar livros no Google.",
				location: "gateways:google_books:find_relevant",
				context: { query },
			});
		}
	}
}
