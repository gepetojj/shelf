import { FileReferenceProps } from "./file-reference";

export type FileProps = {
	id: string;
	title: string;
	description: string;
	authors: string[];
	pages: number;

	collections: string[]; // IDs das estantes que o livro está
	disciplines: string[]; // IDs das disciplinas
	topics: string[]; // IDs dos tópicos
	searchableKeywords: string[];

	defaultFile: FileReferenceProps["id"];
	files: FileReferenceProps[];
	uploaderId: string;
	uploaderFallback: { name: string; avatarUrl: string };
	uploadedAt: number;
};

export abstract class File {
	constructor(protected props: FileProps) {}

	get id() {
		return this.props.id;
	}

	get title() {
		return this.props.title;
	}

	get description() {
		return this.props.description;
	}

	get authors() {
		return this.props.authors;
	}

	get pages() {
		return this.props.pages;
	}

	get collections() {
		return this.props.collections;
	}

	get disciplines() {
		return this.props.disciplines;
	}

	get topics() {
		return this.props.topics;
	}

	get searchableKeywords() {
		return this.props.searchableKeywords;
	}

	get defaultFile() {
		return this.props.defaultFile;
	}

	get files() {
		return this.props.files;
	}

	get uploaderId() {
		return this.props.uploaderId;
	}

	get uploaderFallback() {
		return this.props.uploaderFallback;
	}

	get uploadedAt() {
		return this.props.uploadedAt;
	}

	toJSON(): FileProps {
		return this.props;
	}
}
