import { Container } from "inversify";
import "reflect-metadata";

import { ListRelevantUseCase } from "@/core/app/file-external/list-relevant.use-case";
import { FileExternalGateway } from "@/core/domain/gateways/file-external.gateway";

import { GoogleBooksGateway } from "../gateways/google-books.gateway";
import { http } from "../http";
import { Registry } from "./registry";

export const container = new Container();

container.bind(Registry.Logger).toConstantValue(console);
container.bind(Registry.Http).toConstantValue(http);

container.bind<FileExternalGateway>(Registry.GoogleBooksGateway).to(GoogleBooksGateway);
container.bind<ListRelevantUseCase>(Registry.ListRelevantUseCase).to(ListRelevantUseCase);
