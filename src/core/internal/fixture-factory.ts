import { VariantFixtureFactory, FixtureFactory, FixtureRecipe } from "types";
import type { OverrideBuilder } from "types/internal";
import { FactoryContextImpl } from "./factory-context/factory-context";
import { FixtureRecipeImpl } from "./fixture-recipe";
import { getConfig, getNumberBetween } from "utils/internal";

export class FixtureFactoryImpl<T> implements FixtureFactory<T> {
  constructor(recipe: FixtureRecipeImpl<T>, context: FactoryContextImpl);
  constructor(recipe: FixtureRecipeImpl<T>, context: FactoryContextImpl, variants: FixtureRecipeImpl<T>[]);
  constructor(
    private readonly recipe: FixtureRecipeImpl<T>,
    private readonly context: FactoryContextImpl,
    private readonly variants?: FixtureRecipeImpl<T>[],
  ) {}

  static createInstance<T>(recipe: FixtureRecipeImpl<T>): FixtureFactory<T>;
  static createInstance<T>(recipe: FixtureRecipeImpl<T>, ctx: FactoryContextImpl): FixtureFactory<T>;
  static createInstance<T>(recipe: FixtureRecipeImpl<T>, ctx?: FactoryContextImpl): FixtureFactory<T> {
    if (!ctx) ctx = new FactoryContextImpl();
    return new FixtureFactoryImpl(recipe, ctx);
  }

  withVariants(...variants: FixtureRecipe<T>[]): VariantFixtureFactory<T> {
    if (!variants.length) {
      console.warn("<JsFixture> - No variants provided to `withVariants()`.");
    }
    return new FixtureFactoryImpl(this.recipe, this.context, variants as FixtureRecipeImpl<T>[]);
  }

  create(buildOverride?: OverrideBuilder<T>): T {
    return this.recipe.createFixture(this.context, { variants: this.variants, buildOverride });
  }

  createMany(): T[];
  createMany(length: number): T[];
  createMany(buildOverride: OverrideBuilder<T>): T[];
  createMany(length: number, buildOverride: OverrideBuilder<T>): T[];
  createMany(lengthOrOverride?: number | OverrideBuilder<T>, buildOverride?: OverrideBuilder<T>): T[] {
    let length: number | undefined;
    let actualOverride: OverrideBuilder<T> | undefined;

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
