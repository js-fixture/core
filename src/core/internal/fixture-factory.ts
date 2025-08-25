import { VariantFixtureFactory, FixtureFactory, FixtureRecipe } from "types";
import type { OverrideBuilder } from "types/internal";
import { FactoryContextImpl } from "./factory-context/factory-context";
import { FixtureRecipeImpl } from "./fixture-recipe";
import { getConfig, getNumberBetween } from "utils/internal";

export class FixtureFactoryImpl<TFixture> implements FixtureFactory<TFixture> {
  constructor(recipe: FixtureRecipeImpl<TFixture>, context: FactoryContextImpl<TFixture>);
  constructor(recipe: FixtureRecipeImpl<TFixture>, context: FactoryContextImpl<TFixture>, variants: FixtureRecipeImpl<TFixture>[]);
  constructor(
    private readonly recipe: FixtureRecipeImpl<TFixture>,
    private readonly context: FactoryContextImpl<TFixture>,
    private readonly variants?: FixtureRecipeImpl<TFixture>[],
  ) {}

  static createInstance<T>(recipe: FixtureRecipeImpl<T>): FixtureFactory<T>;
  static createInstance<T>(recipe: FixtureRecipeImpl<T>, ctx: FactoryContextImpl<T>): FixtureFactory<T>;
  static createInstance<T>(recipe: FixtureRecipeImpl<T>, ctx?: FactoryContextImpl<T>): FixtureFactory<T> {
    if (!ctx) ctx = new FactoryContextImpl();
    return new FixtureFactoryImpl(recipe, ctx);
  }

  withVariants(...variants: FixtureRecipe<TFixture>[]): VariantFixtureFactory<TFixture> {
    if (!variants.length) {
      console.warn("<JsFixture> - No variants provided to `withVariants()`.");
    }
    return new FixtureFactoryImpl(this.recipe, this.context, variants as FixtureRecipeImpl<TFixture>[]);
  }

  create(buildOverride?: OverrideBuilder<TFixture>): TFixture {
    return this.recipe.createFixture(this.context, { variants: this.variants, buildOverride });
  }

  createMany(): TFixture[];
  createMany(length: number): TFixture[];
  createMany(buildOverride: OverrideBuilder<TFixture>): TFixture[];
  createMany(length: number, buildOverride: OverrideBuilder<TFixture>): TFixture[];
  createMany(lengthOrOverride?: number | OverrideBuilder<TFixture>, buildOverride?: OverrideBuilder<TFixture>): TFixture[] {
    let length: number | undefined;
    let actualOverride: OverrideBuilder<TFixture> | undefined;

    if (typeof lengthOrOverride === "number") {
      length = lengthOrOverride;
      actualOverride = buildOverride;
    } else {
      actualOverride = lengthOrOverride;
    }

    if (!length) {
      const config = getConfig();
      length = getNumberBetween(config.array.min, config.array.max);
    }

    return Array.from({ length }, () => this.create(actualOverride));
  }
}
