import { inject, injectable } from "inversify";

import { FileExternal } from "@/core/domain/entities/file-external";
import type { FileExternalGateway } from "@/core/domain/gateways/file-external.gateway";
import { Registry } from "@/core/infra/container/registry";

@injectable()
export class ListRelevantUseCase {
	private gate: FileExternalGateway;

	constructor(@inject(Registry.GoogleBooksGateway) gate: FileExternalGateway) {
		this.gate = gate;
	}

	async execute(query: string): Promise<FileExternal[]> {
		return this.gate.findRelevant(query);
	}
}
