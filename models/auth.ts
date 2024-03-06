import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

import { FirestoreAdapter } from "@next-auth/firebase-adapter";

import { config } from "./config";
import { firestore } from "./firebase";

export const auth: NextAuthOptions = {
	providers: [
		Google({
			clientId: config.GOOGLE_ID,
			clientSecret: config.GOOGLE_SECRET,
		}),
	],
	adapter: FirestoreAdapter({ ...firestore, namingStrategy: "snake_case" }),
	callbacks: {
		async session({ session, user }) {
			if (session.user) session.user.id = user.id;
			return session;
		},
	},
};
