import { faker } from "@faker-js/faker";
import { ContextImpl } from "core/internal";
import { isPlaceholderValue, isPlaceholderValueForContext, placeholderValue } from "utils/internal";

interface Foo {
  id: number;
  name: string;
}

describe(placeholderValue.name, () => {
  let recipeUUID: string;
  let ctx: ContextImpl<Foo>;

  beforeEach(() => {
    recipeUUID = faker.string.uuid();
    ctx = new ContextImpl(jest.fn() as any, recipeUUID);
  });

  describe("get()", () => {
    it("should return the value", () => {
      const result = placeholderValue((ctx) => ({ prop: "foo" }), recipeUUID);

      expect(result.get(ctx)).toEqual({ prop: "foo" });
    });
  });

  describe(isPlaceholderValue.name, () => {
    it("should return true when it is a placeholder object", () => {
      const instance = placeholderValue((ctx) => ({ prop: "foo" }), recipeUUID);

      expect(isPlaceholderValue(instance)).toBe(true);
    });

    it("should return false when it is not a contextual object", () => {
      const instance = {
        get: (fixture: Foo) => faker.number.bigInt(),
      };

      expect(isPlaceholderValue(instance)).toBe(false);
    });
  });

  describe(isPlaceholderValueForContext.name, () => {
    it("should return true when it is a placeholder object and the UUIDs match", () => {
      const instance = placeholderValue((ctx) => ({ prop: "foo" }), recipeUUID);

      expect(isPlaceholderValueForContext(recipeUUID, instance)).toBe(true);
    });

    it("should return false when it is a placeholder object but the UUIDs don't match", () => {
      const instance = placeholderValue((ctx) => ({ prop: "foo" }), recipeUUID);

      expect(isPlaceholderValueForContext("wrong_uuid", instance)).toBe(false);
    });

    it("should return false when it is not a contextual object", () => {
      const instance = {
        get: (fixture: Foo) => faker.number.bigInt(),
      };

      expect(isPlaceholderValue(instance)).toBe(false);
    });
  });
});
