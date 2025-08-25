export const CONTEXTUAL = ("contextual");

/**
 * A value that requires the fixture it belongs to in order to be resolved.
 */
export type ContextualValue<TFixture, TValue> = {
  [CONTEXTUAL]: true;
  get: (fixture: TFixture) => TValue | ContextualValue<TFixture, TValue> ;
  toString: () => string;
};

export type ContextualValueFn<TFixture, TValue> = (fixture: TFixture) => TValue;
