import { isOverrideFunction } from "src/utils/internal/override-function";

describe(isOverrideFunction.name, () => {
  it("should return true when the object is an override function", () => {
    const result = isOverrideFunction((ctx) => ({ foo: "bar" }));
    expect(result).toBe(true);
  });

  it("should return true when the object is an object", () => {
    const result = isOverrideFunction({ foo: "bar" });
    expect(result).toBe(false);
  });
});
