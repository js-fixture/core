import { Context, FixtureRecipe } from "types";
import { placeholderValue } from "utils/internal";
import { PlaceholderFixtureFactory } from "../fixture-factory/placeholder-fixture-factory";
/**
 * This context defers the actual execution of each function so that they can be executed with an actual Context when appropriate.
 */
export class PlaceholderContext<TFixture> implements Context<TFixture> {
  
  constructor(private readonly recipeUUID: string) {
  }

  autoIncrement(key?: string) {
    return placeholderValue( (ctx: Context<TFixture>) => ctx.autoIncrement(key), this.recipeUUID) as unknown as number;
  }

  contextualValue<TValue>(fn: (fixture: TFixture) => TValue) {
    return placeholderValue((ctx: Context<TFixture>) => ctx.contextualValue(fn), this.recipeUUID) as unknown as TValue;
  }

  fromRecipe<T>(recipe: FixtureRecipe<T>) {
    return new PlaceholderFixtureFactory(recipe, this.recipeUUID);
  }
}
