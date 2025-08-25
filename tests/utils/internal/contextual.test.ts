import { faker } from "@faker-js/faker";
import { contextualValue, isContextualValue } from "utils/internal";

interface Foo {
  id: number;
  name: string;
}

describe(contextualValue.name, () => {
  describe("get()", () => {
    it("should return the contextual value", () => {
      const fixture: Foo = {
        id: faker.number.int(),
        name: faker.string.uuid(),
      };
      const result = contextualValue((foo) => foo.name, { instance: fixture });

      expect(result.get()).toBe(fixture.name);
    });
  });

  describe("toString()", () => {
    it("should print the contextual value", () => {
      const fixture: Foo = {
        id: faker.number.int(),
        name: faker.string.uuid(),
      };
      const result = contextualValue((foo) => foo.name, { instance: fixture });

      expect(`${result}`).toBe(`${fixture.name}`);
    });

    it("should throw an error when the fixture instance has been set yet", () => {
      const result = contextualValue<Foo, string>((foo) => foo.name, { instance: null });
      
      expect(() => `${result}`).toThrow("ContextualValue cannot be printed before the draft has been created.");
    });
  });
});

describe(isContextualValue.name, () => {
  it("should return true when it is a contextual object", () => {
    const instance = contextualValue(() => faker.number.bigInt(), { instance: null });

    expect(isContextualValue(instance)).toBe(true);
  });

  it("should return false when it is not a contextual object", () => {
    const instance = {
      get: (fixture: Foo) => faker.number.bigInt(),
    };

    expect(isContextualValue(instance)).toBe(false);
  });
});