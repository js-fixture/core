import { CONTEXTUAL, ContextualValue, ContextualValueFn } from "types";

/**
 * Returns a ContextualValue, which will be resolved once the fixture has been created.
 * @param fn Function which returns the contextual value. Accepts the fixture currently being built.
 * @param fixture Wrapper around the fixture currently being built.
 * @returns A ContextualValue.
 */
export function contextualValue<TFixture, TValue>(
  fn: ContextualValueFn<TFixture, TValue>,
  _fixture: { instance: TFixture | null },
): ContextualValue<TFixture, TValue> {
  const testcam = {
    [CONTEXTUAL]: true,
    get: (fixture: TFixture) => {
      if (!_fixture.instance) return testcam;

      const value = fn(_fixture.instance!);
      return isContextualValue<TFixture, TValue>(value) ? value.get(_fixture.instance!) : value;
    },
    toString() {
      if (!_fixture.instance) {
        throw new Error("ContextualValue cannot be printed before the fixture has been created.");
      }
      return `${fn(_fixture.instance)}`;
    },
  } as const;

  return testcam;
}

export function isContextualValue<TFixture, TValue>(value: any): value is ContextualValue<TFixture, TValue> {
  return value && value[CONTEXTUAL] === true;
}
