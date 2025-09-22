import { FixtureFactory, FixtureRecipe, VariantFixtureFactory } from "types";
import { OverrideFunction } from "types/internal";
import { placeholderValue } from "utils/internal";
import { ContextImpl } from "../context";

export class PlaceholderFixtureFactory<TFixture> implements FixtureFactory<TFixture> {
  constructor(
    public readonly recipe: FixtureRecipe<TFixture>,
    public readonly recipeUUID: string,
  ) {}

  withVariants(...variants: FixtureRecipe<TFixture>[]) {
    return placeholderValue(
      (ctx: ContextImpl<TFixture>) => ctx.fromRecipe(this.recipe).withVariants(...variants),
      this.recipeUUID,
    ) as unknown as VariantFixtureFactory<TFixture>;
  }

  create(overrideFn?: OverrideFunction<TFixture> | undefined) {
    return placeholderValue(
      (ctx: ContextImpl<TFixture>) => ctx.fromRecipe(this.recipe).create(overrideFn),
      this.recipeUUID,
    ) as unknown as TFixture;
  }

  createMany(lengthOrOverride?: number | OverrideFunction<TFixture>, overrideFn?: OverrideFunction<TFixture>) {
    return placeholderValue(
      (ctx: ContextImpl<TFixture>) => ctx.fromRecipe(this.recipe).createMany(lengthOrOverride, overrideFn),
      this.recipeUUID,
    ) as unknown as TFixture[];
  }
}
