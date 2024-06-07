import firebase, { type ServiceAccount, credential } from "firebase-admin";

import { config } from "@/config";

export const credentials: ServiceAccount = {
	projectId: config.FIREBASE_ID,
	privateKey: config.FIREBASE_SECRET.replace(/\\n/g, "\n"),
	clientEmail: config.FIREBASE_EMAIL,
};

if (!firebase.apps.length) {
	firebase.initializeApp({
		credential: credential.cert(credentials),
		storageBucket: `${credentials.projectId}.appspot.com`,
	});
}

export const firestore = firebase.firestore();
export const storage = firebase.storage().bucket();
