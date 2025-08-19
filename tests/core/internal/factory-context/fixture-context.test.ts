import { faker } from "@faker-js/faker";
import { FixtureFactoryImpl, FixtureRecipeImpl, FactoryContextImpl } from "core/internal";
import { FixtureFactory, FixtureRecipe } from "types";
import { LazyValue } from "types/internal";

jest.mock("src/utils/internal/get-number-between");

const getNextValueMock = jest.fn();

jest.mock("src/core/internal/factory-context/auto-counter", () => {
  return {
    AutoCounter: jest.fn().mockImplementation(() => ({
      getNextValue: getNextValueMock,
    })),
  };
});

describe(FactoryContextImpl, () => {
  let createFactoryInstance: jest.SpyInstance;

  beforeEach(() => {
    getNextValueMock.mockReset();
    createFactoryInstance = jest.spyOn(FixtureFactoryImpl, "createInstance");
  });

  afterEach(() => {
    createFactoryInstance.mockClear();
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

  describe(FactoryContextImpl.prototype.fromRecipe, () => {
    describe("Recipe hasn't been used before", () => {
      it("should return a new <FixtureFactory>", () => {
        const instance = new FactoryContextImpl();

        const [recipe1, factory1] = createMockRecipe();

        const result1 = instance.fromRecipe(recipe1);

        expect(result1).toBe(factory1);
        expect(createFactoryInstance).toHaveBeenCalledTimes(1);
        createFactoryInstance.mockClear();

        const [recipe2, factory2] = createMockRecipe();
        const result2 = instance.fromRecipe(recipe2);

        expect(result2).toBe(factory2);
        expect(createFactoryInstance).toHaveBeenCalledTimes(1);
      });
    });

    describe("Recipe has been used before", () => {
      it("should return the existing <FixtureFactory> instead of creating a new one", () => {
        const instance = new FactoryContextImpl();

        const [recipe1, factory1] = createMockRecipe();
        const result1 = instance.fromRecipe(recipe1);

        expect(result1).toBe(factory1);
        expect(createFactoryInstance).toHaveBeenCalledTimes(1);
        createFactoryInstance.mockClear();

        const [recipe2, factory2] = createMockRecipe();
        let result2 = instance.fromRecipe(recipe2);

        expect(result2).toBe(factory2);
        expect(createFactoryInstance).toHaveBeenCalledTimes(1);
        createFactoryInstance.mockClear();

        result2 = instance.fromRecipe(recipe2);
        expect(result2).toBe(factory2);
        expect(createFactoryInstance).toHaveBeenCalledTimes(0);
      });
    });
  });

  function createMockRecipe(): [FixtureRecipe<any>, jest.Mock<FixtureFactory<{}>>] {
    const recipe = new FixtureRecipeImpl(() => ({}));
    const factory: jest.Mock<FixtureFactory<{}>> = jest.fn();
    createFactoryInstance.mockReturnValueOnce(factory);
    return [recipe, factory];
  }
});
