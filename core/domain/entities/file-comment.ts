export type FileCommentProps = {
	id: string;
	fileId: string;
	parentCommentId: string;
	content: string;
	creatorId: string;
	createdAt: number;
};

export class FileComment {
	constructor(private props: FileCommentProps) {}

	get id() {
		return this.props.id;
	}

	get fileId() {
		return this.props.fileId;
	}

	get parentCommentId() {
		return this.props.parentCommentId;
	}

	get content() {
		return this.props.content;
	}

	get creatorId() {
		return this.props.creatorId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	toJSON(): FileCommentProps {
		return this.props;
	}

	static fromJSON(json: FileCommentProps): FileComment {
		return new FileComment(json);
	}
}
