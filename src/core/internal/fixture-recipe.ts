import merge from "lodash.merge";
import { FactoryContextImpl } from "./factory-context/factory-context";
import { FixtureFactoryImpl } from "./fixture-factory";
import { RecipeBuilder, OverrideBuilder, Override } from "types/internal";
import { FixtureRecipe, FixtureFactory } from "types";
import { isLazy } from "utils/internal";

export class FixtureRecipeImpl<T> implements FixtureRecipe<T> {
  constructor(buildRecipe: RecipeBuilder<T>);
  constructor(buildRecipe: RecipeBuilder<T>, override: Override<T>);
  constructor(
    private readonly buildRecipe: RecipeBuilder<T>,
    private readonly override?: Override<T>,
  ) {}

  variant(override: Override<T>): FixtureRecipe<T> {
    return new FixtureRecipeImpl(this.buildRecipe, merge(this.override, override));
  }

  createFactory(): FixtureFactory<T> {
    return FixtureFactoryImpl.createInstance(this);
  }

  /**
   * Internal. Creates an actual fixture, applying overrides if provided.
   * @param ctx Context used to build the fixture from the recipe and the overrides.
   * @param options Possible variants and overrides to apply.
   * @returns A fixture.
   */
  createFixture(ctx: FactoryContextImpl, options: { variants?: FixtureRecipeImpl<T>[]; buildOverride?: OverrideBuilder<T> }): T {
    ctx.session.enterCreationMode();

    // Build the template, starting from the original recipe, to variants, to overrides.
    let template = merge(this.buildRecipe(ctx), this.override);

    if (options.variants) {
      options.variants.forEach((v) => (template = merge(template, v.override)));
    }

    if (options.buildOverride) {
      template = merge(template, options.buildOverride(ctx));
    }

    let fixture = template;

    if (ctx.session.isOutermostFactory) {
    // Lazy values must only be resolved when building the outermost fixture, not inner fixtures
      fixture = resolveLazyValues(template) as T;
    }

    ctx.session.exitCreationMode();

    return fixture as T;
  }
}

/**
 * Recursively loops over all properties of the provided object to resolve all lazy values.
 * @param obj
 * @returns An object whose lazy values have been resolved into their real values.
 */
function resolveLazyValues(obj: unknown): unknown {
  if (isLazy(obj)) {
    return  obj.get();
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveLazyValues(item));
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, resolveLazyValues(value)]));
  }

  return obj;
}
