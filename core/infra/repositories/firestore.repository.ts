import { Logger } from "winston";

import {
	Collection,
	Collections,
	DatabaseQuery,
	DatabaseRepository,
} from "@/core/domain/repositories/database.repository";
import { ResourceNotFound, UnknownError } from "@/errors/infra";
import { firestore } from "@/models/firebase";

export class FirestoreRepository implements DatabaseRepository {
	constructor(private logger: Logger) {}

	queryBuilder<Keys>(
		query: DatabaseQuery<Keys>,
		ref: FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>,
	): FirebaseFirestore.Query<FirebaseFirestore.DocumentData> {
		for (const command of query) {
			if ("key" in command) {
				const { key, comparator, value, ignore } = command;
				if (ignore) continue;
				ref = ref.where(key as string, comparator, value);
			}

			if ("offset" in command) {
				const { offset, page, orderBy, sort } = command;
				ref = ref
					.orderBy(orderBy, sort)
					.limit(offset)
					.offset((page - 1) * offset);
			}
		}

		return ref;
	}

	async findOne<Name extends Collection>(
		name: Name,
		query: DatabaseQuery<Collections[Name]>,
	): Promise<Collections[Name]> {
		try {
			const col = firestore.collection(name);
			const snapshot = await this.queryBuilder(query, col).get();
			if (snapshot.empty) {
				throw new ResourceNotFound({ location: "firestore_repository:find_one", context: { name, query } });
			}
			return snapshot.docs[0].data() as Collections[Name];
		} catch (err: any) {
			if (err instanceof ResourceNotFound) throw err;

			this.logger.error("Failed to find item", {
				collection: name,
				err: err.message || err.stack || err,
				query,
			});
			throw new UnknownError({
				message: "Erro ao buscar documento no banco de dados.",
				location: "firestore_repository:find_one",
				context: { name, query },
			});
		}
	}

	async findMany<Name extends Collection>(name: Name): Promise<Collections[Name][]>;
	async findMany<Name extends Collection>(
		name: Name,
		query: DatabaseQuery<Collections[Name]>,
	): Promise<Collections[Name][]>;
	async findMany<Name extends Collection>(
		name: Name,
		query?: DatabaseQuery<Collections[Name]>,
	): Promise<Collections[Name][]> {
		try {
			const col = firestore.collection(name);
			const snapshot = query ? await this.queryBuilder(query, col).get() : await col.get();
			return snapshot.docs.map(doc => doc.data() as Collections[Name]);
		} catch (err: any) {
			this.logger.error("Failed to find items", {
				collection: name,
				err: err.message || err.stack || err,
				query,
			});
			throw new UnknownError({
				message: "Erro ao buscar documentos no banco de dados.",
				location: "firestore_repository:find_many",
				context: { name, query },
			});
		}
	}

	async create<Name extends Collection>(name: Name, id: string, data: Omit<Collections[Name], "id">): Promise<void> {
		try {
			const col = firestore.collection(name);
			await col.doc(id).create({ id, ...data });
		} catch (err: any) {
			this.logger.error("Failed to create item", {
				collection: name,
				err: err.message || err.stack || err,
			});
			throw new UnknownError({
				message: "Erro ao criar documento no banco de dados.",
				location: "firestore_repository:create",
				context: { name, id, data },
			});
		}
	}

	async update<Name extends Collection>(
		name: Name,
		id: string,
		data: Partial<Collections[Name]> | Record<string, any>,
	): Promise<void> {
		try {
			const col = firestore.collection(name);
			await col.doc(id).update({ ...data });
		} catch (err: any) {
			this.logger.error("Failed to update item", {
				collection: name,
				err: err.message || err.stack || err,
			});
			throw new UnknownError({
				message: "Erro ao atualizar documento no banco de dados.",
				location: "firestore_repository:update",
				context: { name, id, data },
			});
		}
	}

	async delete(name: Collection, id: string): Promise<void> {
		try {
			const col = firestore.collection(name);
			await col.doc(id).delete();
		} catch (err: any) {
			this.logger.error("Failed to delete item", {
				collection: name,
				err: err.message || err.stack || err,
			});
			throw new UnknownError({
				message: "Erro ao deletar documento no banco de dados.",
				location: "firestore_repository:delete",
				context: { name, id },
			});
		}
	}
}
