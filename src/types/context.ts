import { ContextualValue } from "./internal/contextual";
import { FixtureFactory } from "./fixture-factory";
import { FixtureRecipe } from "./fixture-recipe";
import { LazyValue } from "./internal";

/**
 * Provides helpers for:
 * - Generating auto-incremented numbers
 * - Creating contextual values (values derived from the current fixture)
 * - Creating factories from nested recipes
 *
 * It maintains state across fixture creation (within the same FixtureFactory instance) to ensure
 * consistent behavior for features like auto-incrementing counters.
 *
 * @example
 * ```typescript
 * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
 *   id: ctx.autoIncrement(),
 *   name: pickFrom(['Alice', 'Bob', 'Charlie']),
 *   email: ctx.contextualValue(user => `${user.name}@example.com`),
 *   profile: ctx.fromRecipe(profileRecipe).create()
 * }));
 * ```
 */
export interface Context<TFixture> {
  /**
   * Generates an auto-incrementing number. Provide a key unique to the current factory to maintain separate sequences for different properties.
   *
   * @param key - Optional counter name (for independent sequences).
   * @returns A number (or lazy value) that increments with each call.
   *
   * @example
   * ```typescript
   * const recipe = JsFixture.defineRecipe<User>((ctx) => ({
   *   id: ctx.autoIncrement(),             // 1, 2, 3, ...
   *   orderId: ctx.autoIncrement('order'), // 1, 2, 3, ...
   *   email: `user${ctx.autoIncrement('email')}@example.com`
   * }));
   * ```
   */
  autoIncrement(key?: string): number | LazyValue<number>;

  /**
   * Returns a lazily evaluated value that can be based on the fixture being created.
   *
   * @param fn - A function that derives a value from the fixture draft.
   * @returns The value returned by `fn`.
   */
  contextualValue<TValue>(fn: (fixture: TFixture) => TValue): TValue | ContextualValue<TFixture, TValue>;

  /**
   * Preferred way of creating a factory for a nested recipe. Will ensure consistent cross-test behavior
   * when nested fixtures are created for features like auto-incrementing counters.
   *
   * @template T - The type of object the nested recipe creates.
   * @param recipe - The FixtureRecipe to create a factory from.
   * @returns A FixtureFactory that can create instances of the nested type.
   *
   * @example
   * ```typescript
   * const addressRecipe = JsFixture.defineRecipe<Address>((ctx) => ({
   *   street: '123 Main St',
   *   city: 'Anytown',
   *   zipCode: '12345'
   * }));
   *
   * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
   *   id: ctx.autoIncrement(),
   *   name: 'John Doe',
   *   address: ctx.fromRecipe(addressRecipe).create()
   * }));
   * ```
   */
  fromRecipe<T>(recipe: FixtureRecipe<T>): FixtureFactory<T>;
}
