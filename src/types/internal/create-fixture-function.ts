import { Recipe } from "./recipe";
import { Context } from '../context';

export type CreateFixtureFunction<TFixture> = (ctx: Context<TFixture>) => Recipe<TFixture>;