import { VariantFixtureFactory, FixtureFactory, FixtureRecipe } from "types";
import type { DraftOptions, OverrideFunction } from "types/internal";
import { FactoryContext } from "./context/factory-context";
import { getConfig, getNumberBetween } from "utils/internal";
import { FixtureRecipeImpl } from "../fixture-recipe";
import { FixtureDraftFactory } from "../fixture-draft";

export class FixtureFactoryImpl<TFixture> implements FixtureFactory<TFixture> {
  private readonly fixtureDraftFactory = new FixtureDraftFactory();

  constructor(
    private readonly recipe: FixtureRecipeImpl<TFixture>,
    private readonly ctx: FactoryContext,
    private readonly variants?: FixtureRecipe<TFixture>[],
  ) {}

  static createInstance<TFixture>(recipe: FixtureRecipeImpl<TFixture>, ctx?: FactoryContext): FixtureFactory<TFixture> {
    if (!ctx) ctx = new FactoryContext();
    return new FixtureFactoryImpl(recipe, ctx);
  }

  withVariants(...variants: FixtureRecipe<TFixture>[]): VariantFixtureFactory<TFixture> {
    if (!variants.length) {
      console.warn("<JsFixture> - No variants provided to `withVariants()`.");
    }
    return new FixtureFactoryImpl(this.recipe, this.ctx, variants as FixtureRecipeImpl<TFixture>[]);
  }

  create(overrideFn?: OverrideFunction<TFixture>): TFixture {
    const options: DraftOptions<TFixture> = {
      variants: this.variants as FixtureRecipeImpl<TFixture>[],
      overrideDraft: overrideFn,
    };
    const draft = this.fixtureDraftFactory.create(this.ctx, this.recipe, options);
    return draft.toFixture();
  }

  createMany(): TFixture[];
  createMany(length: number): TFixture[];
  createMany(overrideFn: OverrideFunction<TFixture>): TFixture[];
  createMany(length: number, overrideFn: OverrideFunction<TFixture>): TFixture[];
  createMany(lengthOrOverride?: number | OverrideFunction<TFixture>, overrideFn?: OverrideFunction<TFixture>): TFixture[] {
    let length: number | undefined;
    let actualOverride: OverrideFunction<TFixture> | undefined;

    if (typeof lengthOrOverride === "number") {
      length = lengthOrOverride;
      actualOverride = overrideFn;
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
