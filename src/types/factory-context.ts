import { FixtureFactory } from "./fixture-factory";
import { FixtureRecipe } from "./fixture-recipe";
import { LazyValue } from "./internal";

/**
 * Per-factory context object provided used when creating fixtures.
 *
 * It maintains state across fixture creation (within the same FixtureFactory instance) to ensure
 * consistent behavior for features like auto-incrementing counters.
 *
 * @example
 * ```typescript
 * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
 *   id: ctx.autoIncrement(),
 *   name: pickFrom(['Alice', 'Bob', 'Charlie']),
 *   email: `user${ctx.autoIncrement('email')}@example.com`,
 *   profile: ctx.fromRecipe(profileRecipe).create()
 * }));
 * ```
 */
export interface FactoryContext {
  /**
   * Generates an auto-incrementing number using the default, nameless counter.
   *
   * Each call to this method will return the next sequential number,
   * starting from 1.
   *
   * @returns A number that increments with each call.
   *
   * @example
   * ```typescript
   * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
   *   id: ctx.autoIncrement(), // 1, 2, 3, 4, ...
   *   name: 'Alice'
   * }));
   * ```
   */
  autoIncrement(): number | LazyValue<number>;

  /**
   * Generates an auto-incrementing number using a named counter.
   *
   * Named counters allow you to maintain separate sequences for different
   * purposes. Each named counter maintains its own state independently.
   *
   * @param key - Name for the counter.
   * @returns A number that increments with each call for this key.
   *
   * @example
   * ```typescript
   * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
   *   id: ctx.autoIncrement('user'),     // 1, 2, 3, ...
   *   orderId: ctx.autoIncrement('order'), // 1, 2, 3, ...
   *   email: `user${ctx.autoIncrement('email')}@example.com` // user1@, user2@, ...
   * }));
   * ```
   */
  autoIncrement(key: string): number | LazyValue<number>;

  /**
   * Generates an auto-incrementing number using a named counter.
   *
   * Named counters allow you to maintain separate sequences for different
   * purposes. Each named counter maintains its own state independently.
   *
   * @param key - Optional name for the counter. If not provided, uses the default counter.
   * @returns A number that increments with each call for this key.
   *
   * @example
   * ```typescript
   * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
   *   id: ctx.autoIncrement(),     // 1, 2, 3, ...
   *   orderId: ctx.autoIncrement('order'), // 1, 2, 3, ...
   *   email: `user${ctx.autoIncrement('email')}@example.com` // user1@, user2@, ...
   * }));
   * ```
   */
  autoIncrement(key?: string): number | LazyValue<number>;

  /**
   * Preferred way of creating a factory for a nested recipe. Will ensure consistent cross-test behavior
   * when nested fixtures are created for features like auto-incrementing counters.   *
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
