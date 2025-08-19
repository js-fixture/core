import { Recipe } from "./recipe";
import { FactoryContext } from '../factory-context';

export type RecipeBuilder<T> = (ctx: FactoryContext) => Recipe<T>;