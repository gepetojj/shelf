import { PrismaClient } from "@prisma/client";

import { container } from ".";
import { logger } from "../logger";
import { FirebaseStorageRepository } from "../repositories/firebase-storage.repository";
import { Registry } from "./registry";

container.rebind(Registry.Logger).toConstantValue(logger);
container.bind(Registry.Prisma).toConstantValue(new PrismaClient());
container
	.bind(Registry.StorageRepository)
	.toDynamicValue(ctx => new FirebaseStorageRepository(ctx.container.get(Registry.Logger)));

export { container };
