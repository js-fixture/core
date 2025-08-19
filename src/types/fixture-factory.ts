import { FixtureRecipe } from "./fixture-recipe";
import { OverrideBuilder } from "./internal";

/**
 * A factory for creating fixtures of type T based on a given recipe.
 *
 * @template T - The type of object this factory creates.
 *
 * @example
 * ```typescript
 * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
 *   id: ctx.autoIncrement(),
 *   name: 'Alice',
 *   email: 'user@example.com'
 * }));
 *
 * const factory = userRecipe.createFactory();
 *
 * // Create single fixtures
 * const user1 = factory.create();
 * const user2 = factory.create({ name: 'Custom Name' });
 *
 * // Create multiple fixtures
 * const users = factory.createMany(5);
 * ```
 */
export interface FixtureFactory<T> {
  /**
   * Returns a new factory that will apply all variants when generating fixtures.
   * The variants are applied in order, with later variants overriding properties
   * from earlier ones.
   *
   * @param variants - One or more variants to apply in sequence.
   * @returns A new factory that applies all variants when creating fixtures.
   *
   * @example
   * ```typescript
   * const baseUser = JsFixture.defineRecipe<User>((ctx) => ({
   *   id: ctx.autoIncrement(),
   *   name: 'John Doe',
   *   role: 'user',
   *   department: 'Engineering'
   * }));
   *
   * const adminVariant = baseUser.variant({ role: 'admin' });
   * const managerVariant = baseUser.variant({ department: 'Management' });
   *
   * const user = baseUser
   *   .createFactory()
   *   .withVariants(adminVariant, managerVariant)
   *   .create();
   * ```
   */
  withVariants(...variants: FixtureRecipe<T>[]): VariantFixtureFactory<T>;

  /**
   * Creates a single fixture of type T.
   *
   * @returns A new fixture of type T.
   */
  create(): T;

  /**
   * Creates a single fixture of type T with optional overrides, allowing to customize specific properties
   * of the generated fixture at creation time.
   *
   * @param buildOverride - Optional partial object to override fixture properties.
   * @returns A new fixture of type T with the specified overrides applied.
   *
   * @example
   * ```typescript
   * const factory = userRecipe.createFactory();
   *
   * // Create with default values
   * const defaultUser = factory.create();
   *
   * // Create with custom email
   * const customUser = factory.create({ email: 'custom@example.com' });
   * ```
   */
  create(buildOverride?: OverrideBuilder<T>): T;

  /**
   * Creates an array of fixtures of type T.
   *
   * The number of fixtures created depends on the global JsFixture configuration
   * settings for array generation.
   *
   * @returns An array of fixtures of type T.
   */
  createMany(): T[];

  /**
   * Creates an array of fixtures of type T with the specified length.
   *
   * @param length - The number of fixtures to create.
   * @returns An array of fixtures with the specified length.
   */
  createMany(length: number): T[];

  /**
   * Creates an array of fixtures of type T with the same optional overrides applied
   * to each fixture, allowing to customize specific properties of the generated
   * fixtures at creation time.
   *
   * The number of fixtures created depends on the global JsFixture configuration
   * settings for array generation.
   *
   * @param buildOverride - Partial object to override recipe properties for all fixtures.
   * @returns An array of fixtures of type T.
   *
   * @example
   * ```typescript
   * const factory = userRecipe.createFactory();
   * const specialUsers = factory.createMany((ctx) => ({
   *   type: 'special'
   * }));
   * ```
   */
  createMany(buildOverride: OverrideBuilder<T>): T[];

  /**
   * Creates an array of fixtures with specified length and overrides.
   *
   * @param length - The number of fixtures to create.
   * @param buildOverride - Partial object to override recipe properties for all fixtures.
   * @returns An array of fixtures of type T.
   *
   * @example
   * ```typescript
   * const factory = userRecipe.createFactory();
   * const testUsers = factory.createMany(3, {
   *   role: 'tester'
   * });
   * ```
   */
  createMany(length: number, buildOverride: OverrideBuilder<T>): T[];

  /**
   * Creates an array of fixtures with specified length and overrides.
   *
   * @param lengthOrOverride - Either the number of fixtures or override object
   * @param buildOverride - Override object when first parameter is length
   * @returns An array of fixtures
   */
  createMany(lengthOrOverride?: number | OverrideBuilder<T>, buildOverride?: OverrideBuilder<T>): T[];
}

/**
 * A factory for creating fixtures of type T based on a given recipe.
 *
 * @template T - The type of object this factory creates.
 */
export type VariantFixtureFactory<T> = Omit<FixtureFactory<T>, "withVariants">;
