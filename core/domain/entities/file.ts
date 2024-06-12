import { FileReferenceProps } from "./file-reference";

export type FileProps = {
	id: string;
	title: string;
	description: string;
	authors: string[];
	pages: number;

	semester: number;
	disciplines: string[];
	topics: string[];

	defaultFile: FileReferenceProps["id"];
	files: FileReferenceProps[];
	uploaderId: string;
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

	get semester() {
		return this.props.semester;
	}

	get disciplines() {
		return this.props.disciplines;
	}

	get topics() {
		return this.props.topics;
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

	get uploadedAt() {
		return this.props.uploadedAt;
	}

	toJSON(): FileProps {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			authors: this.authors,
			pages: this.pages,
			semester: this.semester,
			disciplines: this.disciplines,
			topics: this.topics,
			defaultFile: this.defaultFile,
			files: this.files,
			uploaderId: this.uploaderId,
			uploadedAt: this.uploadedAt,
		};
	}
}
