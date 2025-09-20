import { FixtureFactoryImpl } from "./fixture-factory/fixture-factory";
import { RecipeFunction, Override } from "types/internal";
import { FixtureRecipe, FixtureFactory } from "types";
import { forceMerge } from "utils/internal";

export class FixtureRecipeImpl<TFixture> implements FixtureRecipe<TFixture> {
  constructor(
    public readonly createDraft: RecipeFunction<TFixture>,
    public readonly override?: Override<TFixture>,
  ) {}

  variant(override: Override<TFixture>): FixtureRecipe<TFixture> {
    return new FixtureRecipeImpl(this.createDraft, forceMerge(this.override, override));
  }

  createFactory(): FixtureFactory<TFixture> {
    return FixtureFactoryImpl.createInstance(this);
  }
}
