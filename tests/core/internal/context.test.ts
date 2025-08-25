import { faker } from "@faker-js/faker";
import { FactoryContext, FixtureRecipeImpl } from "core/internal";
import { LazyValue } from "types/internal";
import * as contextualModule from "src/utils/internal/contextual";
import { ContextImpl } from "src/core/internal/context";
import { isLazy } from "utils/internal";

jest.mock("src/utils/internal/contextual");

interface Foo {}

describe(ContextImpl, () => {
  let contextualSpy: jest.SpyInstance;
  let factoryContext: FactoryContext;
  let getNextIncrementMock = jest.fn();
  let getOrCreateFactoryMock = jest.fn();

  beforeEach(() => {
    contextualSpy = jest.spyOn(contextualModule, "contextualValue");

    factoryContext = new FactoryContext();
    factoryContext.getNextIncrement = getNextIncrementMock;
    factoryContext.getOrCreateFactory = getOrCreateFactoryMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe(ContextImpl.prototype.autoIncrement.name, () => {
    it("should return the next value", () => {
      const instance = new ContextImpl<Foo>(factoryContext);
      const expected = faker.number.int();
      getNextIncrementMock.mockReturnValue(expected);

      const result = instance.autoIncrement();

      expect(isLazy(result)).toBe(true);
      expect((result as LazyValue<number>).get()).toEqual(expected);
    });
  });

  describe(ContextImpl.prototype.contextualValue.name, () => {
    it("should return the a contextual value", () => {
      const instance = new ContextImpl<Foo>(factoryContext);
      const expected = faker.number.int();
      contextualSpy.mockReturnValue(expected);

      const result = instance.contextualValue((foo) => "whatever");

      expect(result).toBe(expected);
    });
  });

  describe(ContextImpl.prototype.fromRecipe, () => {
    it("should return a <FixtureFactory>", () => {
      const instance = new ContextImpl<Foo>(factoryContext);
      const recipe = new FixtureRecipeImpl(() => ({
        key: "value",
      }));
      const expected = jest.fn();
      getOrCreateFactoryMock.mockReturnValue(expected);

      const result = instance.fromRecipe(recipe);

      expect(result).toBe(expected);
      expect(getOrCreateFactoryMock).toHaveBeenCalledWith(recipe);
    });
  });
});
