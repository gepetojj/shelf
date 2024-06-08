import { BaseError, BaseErrorProps } from "./base";

export type DefaultInfraProps = BaseErrorProps & {
	context?: Record<string, any>;
};

export class UnknownError extends BaseError {
	protected context: Record<string, any>;

	constructor(protected props: DefaultInfraProps) {
		super({
			message: props.message || "Houve um erro desconhecido.",
			location: props.location,
		});
		this.context = props.context || {};
	}
}

export type ResourceNotFoundProps = DefaultInfraProps & {
	implementation?: string;
};

export class ResourceNotFound extends UnknownError {
	implementation?: string;

	constructor(protected props: ResourceNotFoundProps) {
		super(props);
		this.implementation = props.implementation;
	}
}
