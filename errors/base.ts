export type BaseErrorProps = {
	message?: string;
	location: string;
};

export class BaseError extends Error {
	message: string;
	location: string;

	constructor(protected props: BaseErrorProps) {
		super(props.message);
		this.name = this.constructor.name;
		this.message = props.message || "Houve um erro desconhecido.";
		this.location = props.location;
	}

	get stack(): string | undefined {
		if (typeof window !== "undefined") return undefined;
		return this.stack || new Error().stack;
	}
}
