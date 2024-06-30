import { PrismaClient } from "@prisma/client";

import { container } from ".";
import { logger } from "../logger";
import { FirebaseStorageRepository } from "../repositories/firebase-storage.repository";
import { AchievementServiceImpl } from "../services/achievement.service";
import { AnnotationServiceImpl } from "../services/annotation.service";
import { CommentServiceImpl } from "../services/comment.service";
import { EnduranceServiceImpl } from "../services/endurance.service";
import { TagServiceImpl } from "../services/tag.service";
import { UserServiceImpl } from "../services/user.service";
import { Registry } from "./registry";

container.rebind(Registry.Logger).toConstantValue(logger);
container.bind(Registry.Prisma).toConstantValue(new PrismaClient());
container
	.bind(Registry.StorageRepository)
	.toDynamicValue(ctx => new FirebaseStorageRepository(ctx.container.get(Registry.Logger)));

container.bind(Registry.UserService).toDynamicValue(ctx => {
	return new UserServiceImpl(ctx.container.get(Registry.Prisma), ctx.container.get(Registry.Logger));
});
container.bind(Registry.AchievementService).toDynamicValue(ctx => {
	return new AchievementServiceImpl(ctx.container.get(Registry.Prisma), ctx.container.get(Registry.Logger));
});
container.bind(Registry.CommentService).toDynamicValue(ctx => {
	return new CommentServiceImpl(ctx.container.get(Registry.Prisma), ctx.container.get(Registry.Logger));
});
container.bind(Registry.EnduranceService).toDynamicValue(ctx => {
	return new EnduranceServiceImpl(ctx.container.get(Registry.Prisma), ctx.container.get(Registry.Logger));
});
container.bind(Registry.AnnotationService).toDynamicValue(ctx => {
	return new AnnotationServiceImpl(ctx.container.get(Registry.Prisma), ctx.container.get(Registry.Logger));
});
container.bind(Registry.TagService).toDynamicValue(ctx => {
	return new TagServiceImpl(ctx.container.get(Registry.Prisma), ctx.container.get(Registry.Logger));
});

export { container };
