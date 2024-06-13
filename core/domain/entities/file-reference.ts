export type FileReferenceProps = {
	id: string;
	referenceId: string;

	filename: string;
	extension: string;
	path: string;

	mimetype: string;
	byteSize: number;

	uploadedById: string;
	uploadedAt: number;
};

export class FileReference {
	constructor(private props: FileReferenceProps) {}

	get id() {
		return this.props.id;
	}

	get referenceId() {
		return this.props.referenceId;
	}

	get filename() {
		return this.props.filename;
	}

	get extension() {
		return this.props.extension;
	}

	get path() {
		return this.props.path;
	}

	get mimetype() {
		return this.props.mimetype;
	}

	get byteSize() {
		return this.props.byteSize;
	}

	get uploadedById() {
		return this.props.uploadedById;
	}

	get uploadedAt() {
		return this.props.uploadedAt;
	}

	get formatedFilename() {
		return `${this.filename}.${this.extension}`;
	}

	toJSON(): FileReferenceProps {
		return {
			id: this.id,
			referenceId: this.referenceId,
			filename: this.filename,
			extension: this.extension,
			path: this.path,
			mimetype: this.mimetype,
			byteSize: this.byteSize,
			uploadedById: this.uploadedById,
			uploadedAt: this.uploadedAt,
		};
	}

	static fromJSON(props: FileReferenceProps): FileReference {
		return new FileReference(props);
	}
}
