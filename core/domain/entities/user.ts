export type UserProps = {
	id: string;
	externalId: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
	username: string;
	profileImageUrl: string | null;
	banned: boolean;
};

export class User {
	constructor(private props: UserProps) {}

	get id(): string {
		return this.props.id;
	}

	get externalId(): string {
		return this.props.externalId;
	}

	get firstName(): string | null {
		return this.props.firstName;
	}

	get lastName(): string | null {
		return this.props.lastName;
	}

	get email(): string {
		return this.props.email;
	}

	get username(): string {
		return this.props.username;
	}

	get profileImageUrl(): string | null {
		return this.props.profileImageUrl;
	}

	toJSON(): UserProps {
		return this.props;
	}

	static fromJSON(props: UserProps): User {
		return new User(props);
	}
}
