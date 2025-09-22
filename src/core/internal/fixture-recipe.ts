import { FixtureFactoryImpl } from "./fixture-factory/fixture-factory";
import { Override, OverrideFunction, CreateFixtureFunction } from "types/internal";
import { FixtureRecipe, FixtureFactory } from "types";
import { ContextImpl } from "./context";
import { isOverrideFunction } from "src/utils/internal/override-function";
import { forceMerge } from "utils/internal";

export class FixtureRecipeImpl<TFixture> implements FixtureRecipe<TFixture> {
  constructor(
    public readonly createFixture: CreateFixtureFunction<TFixture>,
    public readonly override?: Override<TFixture> | OverrideFunction<TFixture>,
  ) {}

  variant(override: Override<TFixture> | OverrideFunction<TFixture>): FixtureRecipe<TFixture> {
    return new FixtureRecipeImpl(this.createFixture, override);
  }

  createFactory(): FixtureFactory<TFixture> {
    return FixtureFactoryImpl.createInstance(this);
  }

  /**
   * Internal. Creates a draft of the fixture, combining the base object and the override (if applicable).
   * @param ctx
   * @returns A draft of the fixture.
   */
  draftFixture(ctx: ContextImpl<TFixture>) {
    const recipeOverride = this.override ? (isOverrideFunction(this.override) ? this.override(ctx) : this.override) : undefined;
    return forceMerge(this.createFixture(ctx), recipeOverride);
  }

  /**
   * Internal. Returns the override. If the override is a function, it resolves it using the context.
   * @param ctx
   * @returns The override.
   */
  getResolvedOverride(ctx: ContextImpl<TFixture>) {
    return this.override ? (isOverrideFunction(this.override) ? this.override(ctx) : this.override) : undefined;
  }
}
