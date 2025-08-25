import { CONTEXTUAL, ContextualValue, ContextualValueFn } from "types";

/**
 * Returns a ContextualValue, which will be resolved once the fixture has been created.
 * @param fn Function which returns the contextual value. Accepts the fixture currently being built.
 * @param fixture Wrapper around the fixture currently being built.
 * @returns A ContextualValue.
 */
export function contextualValue<TFixture, TValue>(
  fn: ContextualValueFn<TFixture, TValue>,
): ContextualValue<TFixture, TValue> {
  return {
    [CONTEXTUAL]: true,
    get: (fixture: TFixture) => {
      const value = fn(fixture);
      return isContextualValue<TFixture, TValue>(value) ? value.get(fixture) : value;
    }
  };
}

export function isContextualValue<TFixture, TValue>(value: any): value is ContextualValue<TFixture, TValue> {
  return value && value[CONTEXTUAL] === true;
}
