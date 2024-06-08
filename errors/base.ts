export type BaseErrorProps = {
	message?: string;
	location: string;
};

export class BaseError extends Error {
	constructor(protected props: BaseErrorProps) {
		super(props.message);
		this.name = this.constructor.name;
	}

	get message(): string {
		return this.props.message || "Houve um erro desconhecido.";
	}

	get location(): string {
		return this.props.location;
	}

	get stack(): string | undefined {
		if (typeof window !== "undefined") return undefined;
		return this.stack || new Error().stack;
	}
}
