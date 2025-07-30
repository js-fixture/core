import { enumerate } from "src/utils/internal/enumerate";

describe(enumerate.name, () => {
  describe("String enum", () => {
    it("should return an array of all the values", () => {
      enum MyEnum {
        foo = "foo_value",
        bar = "bar_value",
        baz = "baz_value",
      }

      const result = enumerate(MyEnum);

      expect(result).toEqual(["foo_value", "bar_value", "baz_value"]);
    });
  });

  describe("Number enum", () => {
    it("should return an array of all the values", () => {
      enum MyEnum {
        foo,
        bar,
        baz,
      }

      const result = enumerate(MyEnum);

      expect(result).toEqual([0, 1, 2]);
    });
  });
});
