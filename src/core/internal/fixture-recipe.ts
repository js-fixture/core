import merge from "lodash.merge";
import { FactoryContextImpl } from "./factory-context/factory-context";
import { FixtureFactoryImpl } from "./fixture-factory";
import { RecipeBuilder, OverrideBuilder, Override } from "types/internal";
import { FixtureRecipe, FixtureFactory } from "types";
import { isLazy } from "utils/internal";
import { isContextualValue } from "src/utils/internal/contextual";

export class FixtureRecipeImpl<TFixture> implements FixtureRecipe<TFixture> {
  constructor(buildRecipe: RecipeBuilder<TFixture>);
  constructor(buildRecipe: RecipeBuilder<TFixture>, override: Override<TFixture>);
  constructor(
    private readonly buildRecipe: RecipeBuilder<TFixture>,
    private readonly override?: Override<TFixture>,
  ) {}

  variant(override: Override<TFixture>): FixtureRecipe<TFixture> {
    return new FixtureRecipeImpl(this.buildRecipe, merge(this.override, override));
  }

  createFactory(): FixtureFactory<TFixture> {
    return FixtureFactoryImpl.createInstance(this);
  }

  /**
   * Internal. Creates an actual fixture, applying overrides if provided.
   * @param ctx Context used to build the fixture from the recipe and the overrides.
   * @param options Possible variants and overrides to apply.
   * @returns A fixture.
   */
  createFixture(
    ctx: FactoryContextImpl<TFixture>,
    options: { variants?: FixtureRecipeImpl<TFixture>[]; buildOverride?: OverrideBuilder<TFixture> },
  ): TFixture {
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
      ctx.fixture = template as TFixture;
      // Lazy values must only be resolved when building the outermost fixture, not inner fixtures
      fixture = resolveDeferredValues(template, template) as TFixture;
    }

    ctx.session.exitCreationMode();

    return fixture as TFixture;
  }
}

/**
 * Recursively loops over all properties of the provided object to resolve all deferred values.
 * @param obj The object whose deferred values will resolved into their real values.
 * @returns An object whose deferred values have been resolved into their real values.
 */
function resolveDeferredValues<TFixture>(draft: TFixture, obj: unknown): unknown {
  if (isLazy(obj)) {
    return obj.get();
  }

  if (isContextualValue(obj)) {
    return obj.get(draft);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveDeferredValues(draft,item));
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, resolveDeferredValues(draft,value)]));
  }

  return obj;
}
