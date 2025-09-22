import { faker } from "@faker-js/faker";
import { ContextImpl, FixtureRecipeImpl } from "core/internal";
import { PlaceholderContext } from "src/core/internal/context/placeholder-context";
import { PlaceholderFixtureFactory } from "src/core/internal/fixture-factory/placeholder-fixture-factory";
import { PlaceholderValue } from "types/internal";

const autoIncrementMock = jest.fn();
const contextualValueMock = jest.fn();

const mockCtx: ContextImpl<any> = {
  autoIncrement: autoIncrementMock,
  contextualValue: contextualValueMock,
} as any;

describe(PlaceholderContext.name, () => {
  let instance: PlaceholderContext<any>;

  beforeEach(() => {
    instance = new PlaceholderContext("uuid");
    jest.clearAllMocks();
  });

  describe(PlaceholderContext.prototype.autoIncrement.name, () => {
    it("should return a wrapper around ctx.autoIncrement", () => {
      const key = faker.lorem.word();
      const expected = faker.lorem.word();
      autoIncrementMock.mockReturnValue(expected);

      const wrapper = instance.autoIncrement(key) as unknown as PlaceholderValue<any>;
      const result = wrapper.get(mockCtx);

      expect(wrapper.recipeUUID).toBe("uuid")
      expect(result).toBe(expected);
      expect(autoIncrementMock).toHaveBeenCalledWith(key);
    });
  });

  describe(PlaceholderContext.prototype.contextualValue.name, () => {
    it("should return a wrapper around ctx.contextualValue", () => {
      const fn = (f: any) => f.foo;
      const expected = faker.lorem.word();
      contextualValueMock.mockReturnValue(expected);

      const wrapper = instance.contextualValue(fn) as unknown as PlaceholderValue<any>;
      const result = wrapper.get(mockCtx);

      expect(wrapper.recipeUUID).toBe("uuid")
      expect(result).toBe(expected);
      expect(contextualValueMock).toHaveBeenCalledWith(fn);
    });
  });

  describe(PlaceholderContext.prototype.fromRecipe.name, () => {
    it("should return a placeholder factory", () => {
      const recipe = new FixtureRecipeImpl<any>(() => ({
        id: 1,
      }));

      const result = instance.fromRecipe(recipe);

      expect(result).toBeInstanceOf(PlaceholderFixtureFactory);
    });
  });
});
