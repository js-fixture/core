import { EnumType } from "types/internal";

/**
 * Transforms an enum into an array of values.
 * @param value Enum to transform.
 */
export function enumerate<T extends EnumType>(value: T): T[keyof T][] {
  const values = Object.values(value);
  const numericValues = values.filter((v) => typeof v === "number");

  return (numericValues.length > 0 ? numericValues : values) as T[keyof T][];
}
