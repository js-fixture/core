import { LAZY, LazyValue } from "types/internal";

export function lazyValue<T>(fn: () => T): LazyValue<T> {
  return {
    [LAZY]: true,
    get: fn,
    toString() {
      return `${fn()}`;
    },
  };
}

export function isLazy<T>(value: any): value is LazyValue<T> {
  return value && value[LAZY] === true;
}
