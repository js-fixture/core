import { FixtureRecipe } from "types";
import { RecipeFunction, Override, Config } from "types/internal";
import { setConfig } from "utils/internal";
import { FixtureRecipeImpl } from "./internal";

/**
 * The main entry point of the library.
 */
export class JsFixture {
  private constructor() {}

  /**
   * Defines a recipe (i.e., a template that describes how to create instances of type T).
   * 
   * @template T - The type of object this recipe will create.
   * @param fn - A function that defines how to build an instance of T. Receives a context object that provides utilities such as auto-incrementing IDs, using nested recipes, etc.
   * @returns A FixtureRecipe that can be used to create variants and fixture factories.
   * 
   * @example
   * ```typescript
   * interface Product {
   *   id: number;
   *   category: string;
   * }
   * 
   * const productRecipe = JsFixture.defineRecipe<Product>((ctx) => ({
   *   id: ctx.autoIncrement(),
   *   category: 'Electronics'
   * }));
   * ```
   */
  static defineRecipe<T>(fn: RecipeFunction<T>): FixtureRecipe<T> {
    return new FixtureRecipeImpl(fn);
  }

  /**
   * Configures global settings for the library.
   * 
   * This method allows you to customize the default behavior of the library,
   * such as setting default array length ranges for bulk operations.
   * 
   * @param config - Partial configuration object with settings to override.
   */
  static configure(config: Override<Config>): void {
    setConfig(config);
  }
}
