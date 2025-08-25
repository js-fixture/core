export const LAZY = ("lazy");
export type LazyValue<T> = { [LAZY]: true; get: () => T; toString: () => string };
