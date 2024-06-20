export type FileAnnotationProps = {
	id: string;
	userId: string;
	fileId: string;
	page: number;
	textContent: string;
	comment: string | null;
	createdAt: number;
};

export class FileAnnotation {
	constructor(private props: FileAnnotationProps) {}

	get id() {
		return this.props.id;
	}

	get userId() {
		return this.props.userId;
	}

	get fileId() {
		return this.props.fileId;
	}

	get page() {
		return this.props.page;
	}

	get textContent() {
		return this.props.textContent;
	}

	get comment() {
		return this.props.comment;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	toJSON(): FileAnnotationProps {
		return this.props;
	}

	static fromJSON(props: FileAnnotationProps) {
		return new FileAnnotation(props);
	}
}
