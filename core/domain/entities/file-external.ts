export type FileExternalProps = {
	title: string;
	subtitle: string | null;
	description: string | null;
	authors: string[];
	publishers: string[] | null;
	pages: number;
	globalIdentifier: string | null;
	thumbnailUrl: string | null;
	thumbnailAltUrl: string | null;
};

export class FileExternal {
	constructor(private props: FileExternalProps) {}

	get title() {
		return this.props.title;
	}

	get subtitle() {
		return this.props.subtitle;
	}

	get description() {
		return this.props.description;
	}

	get authors() {
		return this.props.authors;
	}

	get publishers() {
		return this.props.publishers;
	}

	get pages() {
		return this.props.pages;
	}

	get globalIdentifier() {
		return this.props.globalIdentifier;
	}

	get thumbnailUrl() {
		return this.props.thumbnailUrl;
	}

	get thumbnailAltUrl() {
		return this.props.thumbnailAltUrl;
	}

	toJSON(): FileExternalProps {
		return this.props;
	}

	static fromJSON(props: FileExternalProps): FileExternal {
		return new FileExternal(props);
	}
}
