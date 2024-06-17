import { File, FileProps } from "./file";

export type BookProps = FileProps & {
	subtitle: string | null;
	publishers: string[];
	isbn: string | null;
	thumbnail: {
		small: string;
		large: string;
	};
};

export class Book extends File {
	readonly subtitle: string | null;
	readonly publishers: string[];
	readonly isbn: string | null;
	readonly thumbnail: {
		small: string;
		large: string;
	};

	constructor(props: BookProps) {
		super(props);
		this.subtitle = props.subtitle;
		this.publishers = props.publishers;
		this.isbn = props.isbn;
		this.thumbnail = props.thumbnail;
	}

	toJSON(): BookProps {
		return {
			...super.toJSON(),
			subtitle: this.subtitle,
			publishers: this.publishers,
			isbn: this.isbn,
			thumbnail: this.thumbnail,
		};
	}

	static fromJSON(json: BookProps): Book {
		return new Book(json);
	}
}
