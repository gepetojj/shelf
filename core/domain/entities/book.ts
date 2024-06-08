import { File, FileProps } from "./file";

export type BookProps = FileProps & {
	subtitle: string | null;
	publishers: string[];
	isbn10: string | null;
	isbn13: string | null;
	thumbnail: {
		small: string;
		large: string;
	};
};

export class Book extends File {
	readonly subtitle: string | null;
	readonly publishers: string[];
	readonly isbn10: string | null;
	readonly isbn13: string | null;
	readonly thumbnail: {
		small: string;
		large: string;
	};

	constructor(props: BookProps) {
		super(props);
		this.subtitle = props.subtitle;
		this.publishers = props.publishers;
		this.isbn10 = props.isbn10;
		this.isbn13 = props.isbn13;
		this.thumbnail = props.thumbnail;
	}

	static fromJSON(json: BookProps): Book {
		return new Book(json);
	}
}
