import { faker } from "@faker-js/faker";
import { FactoryContext, FixtureFactoryImpl, FixtureRecipeImpl } from "core/internal";
import { FixtureFactory, FixtureRecipe } from "types";

const getNextValueMock = jest.fn();

jest.mock("src/core/internal/fixture-factory/context/auto-counter", () => {
  return {
    AutoCounter: jest.fn().mockImplementation(() => ({
      getNextValue: getNextValueMock,
    })),
  };
});

describe(FactoryContext, () => {
  let createFactoryInstanceSpy: jest.SpyInstance;

  beforeEach(() => {
    createFactoryInstanceSpy = jest.spyOn(FixtureFactoryImpl, "createInstance");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(FactoryContext.prototype.getNextIncrement.name, () => {
    it("should return the next value", () => {
      const instance = new FactoryContext();
      const expected = faker.number.int();
      getNextValueMock.mockReturnValue(expected);

      const result = instance.getNextIncrement();

      expect(result).toEqual(expected);
    });
  });

  describe(FactoryContext.prototype.getOrCreateFactory, () => {
    describe("Recipe hasn't been used before", () => {
      it("should return a new <FixtureFactory>", () => {
        const instance = new FactoryContext();

        const [recipe1, factory1] = createMockRecipe();

        const result1 = instance.getOrCreateFactory(recipe1);

        expect(result1).toBe(factory1);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
        expect(createFactoryInstanceSpy.mock.calls[0][1]).not.toBe(instance);
        expect(createFactoryInstanceSpy.mock.calls[0][1].depthTracker).toBe(instance.depthTracker);
        createFactoryInstanceSpy.mockClear();

        const [recipe2, factory2] = createMockRecipe();
        const result2 = instance.getOrCreateFactory(recipe2);

        expect(result2).toBe(factory2);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
        expect(createFactoryInstanceSpy.mock.calls[0][1]).not.toBe(instance);
        expect(createFactoryInstanceSpy.mock.calls[0][1].depthTracker).toBe(instance.depthTracker);
      });
    });

    describe("Recipe has been used before", () => {
      it("should return the existing <FixtureFactory> instead of creating a new one", () => {
        const instance = new FactoryContext();

        const [recipe1, factory1] = createMockRecipe();
        const result1 = instance.getOrCreateFactory(recipe1);

        expect(result1).toBe(factory1);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
        createFactoryInstanceSpy.mockClear();

        const [recipe2, factory2] = createMockRecipe();
        let result2 = instance.getOrCreateFactory(recipe2);

        expect(result2).toBe(factory2);
        expect(createFactoryInstanceSpy).toHaveBeenCalledTimes(1);
        createFactoryInstanceSpy.mockClear();

        result2 = instance.getOrCreateFactory(recipe2);
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
