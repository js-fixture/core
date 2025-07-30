export const NESTED_FACTORY = Symbol("nested_factory");
export type NestedFactory<T> = { [NESTED_FACTORY]: true; get: () => T };

