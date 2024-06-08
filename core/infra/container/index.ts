import { Container } from "inversify";
import "reflect-metadata";

import { Registry } from "./registry";

export const container = new Container();

container.bind(Registry.Logger).toConstantValue(console);
