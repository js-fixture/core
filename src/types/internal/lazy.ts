export const LAZY = "lazy" as const;

/**
 * Represents a lazily evaluated value of type `TValue`.
 */
export type LazyValue<TValue> = { [LAZY]: true; get: () => TValue; toString: () => string };
