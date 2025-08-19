import { Override } from "./override";
import { Recipe } from "./recipe";
import { FactoryContext } from "../factory-context";

export type OverrideBuilder<T> = (ctx: FactoryContext) => Recipe<Override<T>>;
