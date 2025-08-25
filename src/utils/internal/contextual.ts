import { CONTEXTUAL, ContextualValue, ContextualValueFn } from "types";

/**
 * Returns a ContextualValue, which will be resolved once the fixture has been created.
 * @param fn Function which returns the contextual value. Accepts the fixture currently being built.
 * @param draft Wrapper around the draft currently being built.
 * @returns A ContextualValue.
 */
export function contextualValue<TFixture, TValue>(
  fn: ContextualValueFn<TFixture, TValue>,
  draft: { instance: TFixture | null },
): ContextualValue<TFixture, TValue> {
  const instance = {
    [CONTEXTUAL]: true,
    get: () => {
      if (!draft.instance) return instance;

      const value = fn(draft.instance!);
      return isContextualValue<TFixture, TValue>(value) ? value.get() : value;
    },
    toString: () => {
      if (!draft.instance) {
        throw new Error("ContextualValue cannot be printed before the draft has been created.");
      }
      return `${fn(draft.instance)}`;
    },
  } as const;

  return instance;
}

export function isContextualValue<TFixture, TValue>(value: any): value is ContextualValue<TFixture, TValue> {
  return value && value[CONTEXTUAL] === true;
}
