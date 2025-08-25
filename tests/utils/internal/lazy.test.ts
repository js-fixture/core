import { faker } from "@faker-js/faker";
import { isLazy, lazyValue } from "utils/internal";

describe(lazyValue.name, () => {
  it("should be possible to obtain the value", () => {
    const expected = faker.number.bigInt();
    const result = lazyValue(() => expected);

    expect(result.get()).toBe(expected);
  });
  
  it("should print the value when printing the function", () => {
    const expected = faker.number.bigInt();
    const result = lazyValue(() => expected);

    expect(`${result}`).toBe(`${expected}`);
  });
});

describe(isLazy.name, () => {
  it("should return true when it is a lazy object", () => {
    const result = lazyValue(() => faker.number.bigInt());

    expect(isLazy(result)).toBe(true);
  });

  it("should return false when it is not a lazy object", () => {
    const nonLazyValue = {
      get: () => faker.number.bigInt()
    };

    expect(isLazy(nonLazyValue)).toBe(false);
  });
});
