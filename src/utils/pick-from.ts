import { EnumType } from "types/internal";
import { enumerate, getNumberBetween } from "./internal";

/**
 * Randomly selects and returns one element from the provided array.
 * 
 * @param values - Array of values to choose from.
 * @returns A randomly selected element from the array.
 * 
 * @example
 * ```typescript
 * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
 *   name: pickFromArray(['Alice', 'Bob', 'Charlie', 'Diana'])
 * }));
 * ```
 */
export function pickFromArray<T>(values: T[]): T {
  const index = getNumberBetween(0, values.length - 1);
  return values[index];
}

/**
 * Randomly selects and returns one value from the provided enum.
 * 
 * Works with TypeScript enums (both string and numeric).
 * 
 * @param value - The enum object to choose from.
 * @returns A randomly selected value from the enum.
 * 
 * @example
 * ```typescript
 * enum UserStatus {
 *   ACTIVE = 'active',
 *   INACTIVE = 'inactive',
 *   PENDING = 'pending',
 *   SUSPENDED = 'suspended'
 * }
 * 
 * enum Priority {
 *   LOW = 1,
 *   MEDIUM = 2,
 *   HIGH = 3,
 *   CRITICAL = 4
 * }
 * 
 * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
 *   status: pickFromEnum(UserStatus),
 *   priority: pickFromEnum(Priority)
 * }));
 * ```
 */
export function pickFromEnum<T extends EnumType>(value: T): T[keyof T] {
  const values = enumerate(value);
  return pickFromArray(values);
}
