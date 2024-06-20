import { BookProps } from "../entities/book";
import { FileAnnotationProps } from "../entities/file-annotation";
import { FileCommentProps } from "../entities/file-comment";
import { UserProps } from "../entities/user";

export interface Collections {
	books: BookProps;
	file_annotations: FileAnnotationProps;
	file_comments: FileCommentProps;
	users: UserProps;
}

export type Collection = keyof Collections;

type Leaves<T> = T extends object
	? {
			[K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`;
		}[keyof T]
	: never;

export type QueryLanguage<Keys> =
	| {
			key: Leaves<Keys>;
			comparator: "==" | "<" | "<=" | ">" | ">=" | "array-contains" | "in";
			value: any;
			ignore?: boolean;
	  }
	| {
			orderBy: Leaves<Keys>;
			sort?: "asc" | "desc";
			offset: number;
			page: number;
	  };

export type DatabaseQuery<Keys> = QueryLanguage<Keys>[];

export interface DatabaseRepository {
	findOne<Name extends Collection>(col: Name, query: DatabaseQuery<Collections[Name]>): Promise<Collections[Name]>;

	findMany<Name extends Collection>(col: Name): Promise<Collections[Name][]>;
	findMany<Name extends Collection>(col: Name, query: DatabaseQuery<Collections[Name]>): Promise<Collections[Name][]>;

	create<Name extends Collection>(col: Name, id: string, data: Omit<Collections[Name], "id">): Promise<void>;

	update<Name extends Collection>(
		col: Name,
		id: string,
		data: Partial<Collections[Name]> | Record<string, any>,
	): Promise<void>;

	delete<Name extends Collection>(col: Name, id: string): Promise<void>;
}
