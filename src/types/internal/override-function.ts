import { Override } from "./override";
import { Recipe } from "./recipe";
import { Context } from "../context";

export type OverrideFunction<TFixture> = (ctx: Context<TFixture>) => Recipe<Override<TFixture>>;
