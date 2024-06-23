import { PrismaClient } from "@prisma/client";

import { container } from ".";
import { logger } from "../logger";
import { FirebaseStorageRepository } from "../repositories/firebase-storage.repository";
import { FirestoreRepository } from "../repositories/firestore.repository";
import { Registry } from "./registry";

container.rebind(Registry.Logger).toConstantValue(logger);
container
	.bind(Registry.DatabaseRepository)
	.toDynamicValue(ctx => new FirestoreRepository(ctx.container.get(Registry.Logger)));
container.bind(Registry.Prisma).toDynamicValue(() => new PrismaClient());
container
	.bind(Registry.StorageRepository)
	.toDynamicValue(ctx => new FirebaseStorageRepository(ctx.container.get(Registry.Logger)));

export { container };
