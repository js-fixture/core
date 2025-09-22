import { faker } from "@faker-js/faker";
import { ContextImpl, FixtureRecipeImpl } from "core/internal";
import { PlaceholderFixtureFactory } from "src/core/internal/fixture-factory/placeholder-fixture-factory";
import { FixtureFactory } from "types";
import { PlaceholderValue } from "types/internal";

const withVariantsMock = jest.fn();
const createMock = jest.fn();
const createManyMock = jest.fn();

const autoIncrementMock = jest.fn();
const contextualValueMock = jest.fn();
const fromRecipeMock = jest.fn();

const mockFactory: FixtureFactory<any> = {
  withVariants: withVariantsMock,
  create: createMock,
  createMany: createManyMock,
};

const mockCtx: ContextImpl<any> = {
  autoIncrement: autoIncrementMock,
  contextualValue: contextualValueMock,
  fromRecipe: fromRecipeMock,
} as any;

describe(PlaceholderFixtureFactory.name, () => {
  let instance: PlaceholderFixtureFactory<any>;
  const recipe = new FixtureRecipeImpl<any>(() => ({
    id: 1,
  }));

  beforeEach(() => {
    instance = new PlaceholderFixtureFactory(recipe, "uuid");
    jest.clearAllMocks();
  });

  describe(PlaceholderFixtureFactory.prototype.withVariants.name, () => {
    it("should return a wrapper around ctx.withVariants", () => {
      const expected = faker.lorem.word();
      fromRecipeMock.mockReturnValue(mockFactory);
      withVariantsMock.mockReturnValue(expected);
      const variant = jest.fn() as any;

      const wrapper = instance.withVariants(variant) as unknown as PlaceholderValue<any>;
      const result = wrapper.get(mockCtx);

      expect(result).toBe(expected);
      expect(fromRecipeMock).toHaveBeenCalledWith(recipe);
      expect(withVariantsMock).toHaveBeenCalledWith(variant);
    });
  });

  describe(PlaceholderFixtureFactory.prototype.create.name, () => {
    it("should return a wrapper around ctx.create", () => {
      const expected = faker.lorem.word();
      fromRecipeMock.mockReturnValue(mockFactory);
      createMock.mockReturnValue(expected);
      const overrideFn = jest.fn();

      const wrapper = instance.create(overrideFn) as unknown as PlaceholderValue<any>;
      const result = wrapper.get(mockCtx);

      expect(result).toBe(expected);
      expect(fromRecipeMock).toHaveBeenCalledWith(recipe);
      expect(createMock).toHaveBeenCalledWith(overrideFn);
    });
  });

  describe(PlaceholderFixtureFactory.prototype.createMany.name, () => {
    it("should return a wrapper around ctx.createMany", () => {
      const expected = faker.lorem.word();
      fromRecipeMock.mockReturnValue(mockFactory);
      createManyMock.mockReturnValue(expected);
      const length = faker.number.int();
      const overrideFn = jest.fn();

      const wrapper = instance.createMany(length, overrideFn) as unknown as PlaceholderValue<any>;
      const result = wrapper.get(mockCtx);

      expect(result).toBe(expected);
      expect(fromRecipeMock).toHaveBeenCalledWith(recipe);
      expect(createManyMock).toHaveBeenCalledWith(length, overrideFn);
    });
  });
});
