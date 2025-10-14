import { Override, OverrideFunction } from "types/internal";

export function isOverrideFunction<TFixture>(
  value: Override<TFixture> | OverrideFunction<TFixture>,
): value is OverrideFunction<TFixture> {
  return value && typeof value == "function";
}
