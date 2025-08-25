import { Recipe } from "./recipe";
import { Context } from '../context';

export type RecipeFunction<TFixture> = (ctx: Context<TFixture>) => Recipe<TFixture>;