import { FixtureFactory } from "./fixture-factory";
import { Override } from "./internal";

/**
 * Represents a fixture recipe that defines how to create instances of type T.
 * 
 * @template T - The type of object this recipe creates.
 * 
 * @example
 * ```typescript
 * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
 *   id: ctx.autoIncrement(),
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * }));
 * 
 * // Create a variant with different defaults
 * const adminRecipe = userRecipe.variant({ role: 'admin' });
 * 
 * // Create a factory to generate instances
 * const factory = userRecipe.createFactory();
 * ```
 */
export interface FixtureRecipe<T> {
  /**
   * Creates a new recipe variant with the specified overrides, allowing the creation of
   * specialized versions of a recipe with different default values.
   * 
   * @param override - Partial object with properties to override in the recipe.
   * @returns A new FixtureRecipe with the specified overrides applied.
   * 
   * @example
   * ```typescript
   * const baseUserRecipe = JsFixture.defineRecipe<User>((ctx) => ({
   *   id: ctx.autoIncrement(),
   *   name: 'John Doe',
   *   role: 'user',
   *   settings: { theme: 'light', notifications: true }
   * }));
   * 
   * // Create an admin variant
   * const adminRecipe = baseUserRecipe.variant({
   *   role: 'admin',
   *   settings: { notifications: false }
   * });
   * ```
   */
  variant(override: Override<T>): FixtureRecipe<T>;

  /**
   * Creates a factory from this recipe for generating fixtures.
   * 
   * @returns A FixtureFactory that can generate instances of type T.
   */
  createFactory(): FixtureFactory<T>;
}
