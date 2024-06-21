export type FileTagProps = {
	id: string;
	type: "discipline" | "topic";
	name: string;
	indexableName: string;
	searchableName: string[];
};

export class FileTag {
	constructor(private props: FileTagProps) {}

	get id() {
		return this.props.id;
	}

	get type() {
		return this.props.type;
	}

	get name() {
		return this.props.name;
	}

	get indexableName() {
		return this.props.indexableName;
	}

	get searchableName() {
		return this.props.searchableName;
	}

	toJSON(): FileTagProps {
		return this.props;
	}

	static fromJSON(json: FileTagProps) {
		return new FileTag(json);
	}

	static sanitize(name: string) {
		return name.replaceAll(/['"\/\.,;:><|\[\](){}*&%$#@!=\+\-\_]/g, "").trim();
	}

	static nameToIndexable(name: string) {
		return this.sanitize(name).toLowerCase().replaceAll(" ", "-");
	}

	static nameToSearchable(name: string) {
		return this.sanitize(name).toLowerCase().split(" ");
	}
}
