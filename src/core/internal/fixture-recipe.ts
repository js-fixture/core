import { FixtureFactoryImpl } from "./fixture-factory/fixture-factory";
import { Override, OverrideFunction, Recipe, RecipeFunction } from "types/internal";
import { FixtureRecipe, FixtureFactory } from "types";
import { forceMerge, isPlaceholderValue } from "utils/internal";
import { ContextImpl, PlaceholderContext } from "./context";
import { isOverrideFunction } from "src/utils/internal/override-function";
import { v4 as uuidv4 } from "uuid";

export class FixtureRecipeImpl<TFixture> implements FixtureRecipe<TFixture> {
  public readonly baseObject: Recipe<TFixture>;
  public readonly uuid: string;

  private readonly placeholderContext: PlaceholderContext<TFixture>;

  constructor(
    private readonly createRecipe: RecipeFunction<TFixture>,
    public readonly override?: Recipe<Override<TFixture>>,
    uuid?: string,
  ) {
    this.uuid = uuid || uuidv4();
    this.placeholderContext = new PlaceholderContext<TFixture>(this.uuid);
    this.baseObject = createRecipe(this.placeholderContext);
  }

  variant(override: Override<TFixture> | OverrideFunction<TFixture>): FixtureRecipe<TFixture> {
    const recipeOverride = isOverrideFunction(override) ? override(this.placeholderContext) : override;
    return new FixtureRecipeImpl(this.createRecipe, recipeOverride, this.uuid);
  }

  createFactory(): FixtureFactory<TFixture> {
    return FixtureFactoryImpl.createInstance(this);
  }

  /**
   * Internal. Creates a draft of the recipe, combining the base object and the override.
   * @param ctx 
   * @returns A draft of the recipe.
   */
  draft(ctx: ContextImpl<TFixture>) {
    return this.resolveLayer(forceMerge(this.baseObject, this.override), ctx);
  }

  /**
   * Internal. Creates a draft from the recipe's override.
   * @param ctx 
   * @returns A draft of the recipe's override.
   */
  draftAsVariant(ctx: ContextImpl<TFixture>) {
    return this.resolveLayer(this.override, ctx);
  }

  private resolveLayer<TFixture>(obj: any, ctx: ContextImpl<TFixture>): unknown {
    if (isPlaceholderValue(obj)) {
      return obj.get(ctx);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.resolveLayer(item, ctx));
    }

    if (obj && typeof obj === "object" && !(obj instanceof Date)) {
      return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, this.resolveLayer(value, ctx)]));
    }

    return obj;
  }
}
