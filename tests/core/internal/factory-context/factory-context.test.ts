import { faker } from "@faker-js/faker";
import { FixtureFactoryImpl, FixtureRecipeImpl, FactoryContextImpl } from "core/internal";
import { FixtureFactory, FixtureRecipe } from "types";
import { LazyValue } from "types/internal";
import * as contextualModule from "src/utils/internal/contextual";

jest.mock("src/utils/internal/contextual");

const getNextValueMock = jest.fn();

jest.mock("src/core/internal/factory-context/auto-counter", () => {
  return {
    AutoCounter: jest.fn().mockImplementation(() => ({
      getNextValue: getNextValueMock,
    })),
  };
});

describe(FactoryContextImpl, () => {
  let createFactoryInstanceSpy: jest.SpyInstance;
  let contextualSpy: jest.SpyInstance;

  beforeEach(() => {
    getNextValueMock.mockReset();
    createFactoryInstanceSpy = jest.spyOn(FixtureFactoryImpl, "createInstance");
    contextualSpy = jest.spyOn(contextualModule, "contextualValue").mockImplementation((...args) => {
      return jest.requireActual("src/utils/internal/contextual").contextualValue(...args);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe(FactoryContextImpl.prototype.autoIncrement.name, () => {
    it("should return the next value", () => {
      const instance = new FactoryContextImpl();
      const expected = faker.number.int();
      getNextValueMock.mockReturnValue(expected);

      const result = instance.autoIncrement() as LazyValue<number>;

      expect(result.get()).toEqual(expected);
    });
  });

  describe(FactoryContextImpl.prototype.contextualValue, () => {
    it("should return a contextual value created from the provided function and the current fixture", () => {
      interface Foo {
        id: number;
      }
      const fn = (foo: Foo) => foo.id;
      const fixture: Foo = { id: 5 };
      const instance = new FactoryContextImpl<Foo>();

      instance.fixture = fixture;
      const result = instance.contextualValue(fn);

      expect(result).toBeTruthy();
      expect(contextualSpy).toHaveBeenCalledWith(fn, expect.objectContaining({ instance: fixture }));
    });
  });

  describe(FactoryContextImpl.prototype.fromRecipe, () => {
    describe("Recipe hasn't been used before", () => {
      it("should return a new <FixtureFactory>", () => {
        const instance = new FactoryContextImpl();

        const [recipe1, factory1] = createMockRecipe();

        const result1 = instance.fromRecipe(recipe1);

        expect(result1).toBe(factory1);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
        createFactoryInstanceSpy.mockClear();

        const [recipe2, factory2] = createMockRecipe();
        const result2 = instance.fromRecipe(recipe2);

        expect(result2).toBe(factory2);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("Recipe has been used before", () => {
      it("should return the existing <FixtureFactory> instead of creating a new one", () => {
        const instance = new FactoryContextImpl();

        const [recipe1, factory1] = createMockRecipe();
        const result1 = instance.fromRecipe(recipe1);

        expect(result1).toBe(factory1);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
        createFactoryInstanceSpy.mockClear();

        const [recipe2, factory2] = createMockRecipe();
        let result2 = instance.fromRecipe(recipe2);

        expect(result2).toBe(factory2);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
        createFactoryInstanceSpy.mockClear();

        result2 = instance.fromRecipe(recipe2);
        expect(result2).toBe(factory2);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  function createMockRecipe(): [FixtureRecipe<any>, jest.Mock<FixtureFactory<{}>>] {
    const recipe = new FixtureRecipeImpl(() => ({}));
    const factory: jest.Mock<FixtureFactory<{}>> = jest.fn();
    createFactoryInstanceSpy.mockReturnValueOnce(factory);
    return [recipe, factory];
  }
});
