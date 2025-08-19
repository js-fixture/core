export const LAZY = Symbol("lazy");
export type LazyValue<T> = { [LAZY]: true; get: () => T; toString: () => string };
