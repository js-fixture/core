import { faker } from "@faker-js/faker";
import { isLazy, lazy } from "utils/internal";

describe(lazy.name, () => {
  it("should be possible to obtain the value", () => {
    const expected = faker.number.bigInt();
    const lazyValue = lazy(() => expected);

    expect(lazyValue.get()).toBe(expected);
  });
});

describe(isLazy.name, () => {
  it("should return true when it is a lazy object", () => {
    const lazyValue = lazy(() => faker.number.bigInt());

    expect(isLazy(lazyValue)).toBe(true);
  });

  it("should return false when it is not a lazy object", () => {
    const nonLazyValue = {
      get: () => faker.number.bigInt(),
      lazy: true,
    };

    expect(isLazy(nonLazyValue)).toBe(false);
  });
});
