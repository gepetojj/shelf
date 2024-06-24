import { Logger } from "winston";

import { Registry } from "@/core/infra/container/registry";
import { container } from "@/core/infra/container/server-only";
import { UnknownError } from "@/errors/infra";

const logger = container.get<Logger>(Registry.Logger);

export type PromiseHandlerMetadata = {
	location: string;
	message?: string;
};

export const promiseHandler = async <I>(promise: Promise<I>, metadata: PromiseHandlerMetadata): Promise<I> => {
	try {
		return await promise;
	} catch (err: any) {
		logger.error(
			`[promise_handler:error] Failed to execute promise @ ${metadata.location}: ${metadata.message || err.message}`,
		);
		logger.debug("[promise_handler:error] Promise error details:", { err, promise, metadata });
		throw new UnknownError({
			message: metadata.message || err.message,
			location: metadata.location,
			context: { err, promise, metadata },
		});
	}
};
