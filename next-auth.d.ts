import { Session as NSession } from "next-auth";

declare module "next-auth" {
	interface Session extends NSession {
		user?: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}
