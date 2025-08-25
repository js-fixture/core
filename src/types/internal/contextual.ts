export const CONTEXTUAL = "contextual" as const;

/**
 * Represents a value that depends on the fixture it belongs to.
 */
export type ContextualValue<TFixture, TValue> = {
  [CONTEXTUAL]: true;

  /**
   * Resolves the value.
   */
  get: () => TValue | ContextualValue<TFixture, TValue>;

  toString: () => string;
};
export type ContextualValueFn<TFixture, TValue> = (fixture: TFixture) => TValue;
