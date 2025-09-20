import { forceMerge } from "utils/internal";

describe(forceMerge.name, () => {
  describe("same properties in both objects", () => {
    it("should return the equivalent of the other object", () => {
      const obj = { a: 1, b: 2 };
      const other = { a: 3, b: 4 };

      const result = forceMerge(obj, other);
      expect(result).toEqual({ a: 3, b: 4 });
    });
  });

  describe("unset property in src object", () => {
    it("should let the property from the other object win", () => {
      const obj = { a: 1 };
      const other = { a: 3, b: 4 };

      const result = forceMerge(obj, other);
      expect(result).toEqual({ a: 3, b: 4 });
    });
  });

  describe("unset property in other object", () => {
    it("should let the property from the source object win", () => {
      const obj = { a: 1, b: 2 };
      const other = { a: 3 };

      const result = forceMerge(obj, other);
      expect(result).toEqual({ a: 3, b: 2 });
    });
  });

  describe("property from the other object set to undefined", () => {
    it("should lead to an undefined property in the resulting object", () => {
      const obj = { a: 1, b: 2 };
      const other = { a: 3, b: undefined };

      const result = forceMerge(obj, other);
      expect(result).toEqual({ a: 3, b: undefined });
    });
  });
});
