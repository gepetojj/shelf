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

const storage = firebase.storage().bucket();

if (process.env.NODE_ENV === "production") {
	try {
		(async () => {
			const [meta] = await storage.getMetadata();
			const deleteRules = (meta.lifecycle?.rule || []).filter(rule => rule.action.type === "Delete");

			if (deleteRules.length > 1) {
				await storage.setMetadata({ lifecycle: null });
				deleteRules.length = 0;
			}

			if (deleteRules.length === 0) {
				await storage.addLifecycleRule({
					action: {
						type: "Delete",
					},
					condition: {
						age: 1,
						matchesPrefix: ["chunk_uploads"],
					},
				});
			}
		})();
	} catch (err: any) {
		console.error("Failed to set lifecycle rule", {
			err: err.message || err.stack || err,
		});
	}
}

export { storage };
