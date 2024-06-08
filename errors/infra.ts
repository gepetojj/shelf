import { BaseError, BaseErrorProps } from "./base";

export type DefaultInfraProps = BaseErrorProps & {
	context?: Record<string, any>;
};

export class UnknownError extends BaseError {
	constructor(protected props: DefaultInfraProps) {
		super({
			message: props.message || "Houve um erro desconhecido.",
			location: props.location,
		});
	}

	get context() {
		return this.props.context;
	}
}

export type ResourceNotFoundProps = DefaultInfraProps & {
	implementation?: string;
};

export class ResourceNotFound extends UnknownError {
	constructor(protected props: ResourceNotFoundProps) {
		super(props);
	}

	get implementation() {
		return this.props.implementation;
	}
}
