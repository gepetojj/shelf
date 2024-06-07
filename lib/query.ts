import { firestore } from "@/models/firebase";

export interface QueryConverter<Type> {
	toFirestore: (item: Type) => FirebaseFirestore.DocumentData;
	fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => Type;
}

export const query = <Type>(name: string, converter?: QueryConverter<Type>) => {
	const defaultConverter: QueryConverter<Type> = {
		toFirestore: item => {
			return item as FirebaseFirestore.DocumentData;
		},
		fromFirestore: snapshot => {
			const data = snapshot.data() as Type;
			return data;
		},
	};
	const col = firestore.collection(name).withConverter(converter || defaultConverter);

	const id = (id: string) => {
		return col.doc(id);
	};

	const where = (path: string, op: FirebaseFirestore.WhereFilterOp, value: any) => {
		return col.where(path, op, value);
	};

	return {
		col,
		id,
		where,
	};
};

export const resolver = <Type>(
	snapshot: FirebaseFirestore.QueryDocumentSnapshot<Type, FirebaseFirestore.DocumentData>[],
) => {
	const queryDocs = snapshot.filter(doc => doc.exists && doc.data() !== undefined);
	const docs = queryDocs.map(doc => doc.data() as Type);
	return docs;
};
