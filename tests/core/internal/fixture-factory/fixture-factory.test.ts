import { faker } from "@faker-js/faker";
import { FactoryContext, FixtureFactoryImpl, FixtureRecipeImpl } from "core/internal";
import { DraftOptions, OverrideFunction } from "types/internal";
import { getNumberBetween } from "utils/internal";

jest.mock("src/utils/internal/get-number-between");
jest.mock("src/core/internal/fixture-draft/fixture-draft-factory");

const getNumberBetweenMock = jest.mocked(getNumberBetween);

const createDraftMock = jest.fn();
const draftToFixtureMock = jest.fn();

interface Foo {
  id: number;
  name: string;
}

jest.mock("src/core/internal/fixture-draft/fixture-draft-factory", () => {
  return {
    FixtureDraftFactory: jest.fn().mockImplementation(() => ({
      create: createDraftMock.mockImplementation(() => ({
        toFixture: draftToFixtureMock,
      })),
    })),
  };
});

function createOptions(variants?: FixtureRecipeImpl<any>[], overrideDraft?: OverrideFunction<any>): DraftOptions<any> {
  return { variants, overrideDraft };
}

describe(FixtureFactoryImpl.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe(FixtureFactoryImpl.createInstance.name, () => {
    describe("No ctx provided", () => {
      it("should return a <FixtureFactory>", () => {
        const recipe = new FixtureRecipeImpl(() => ({}));

        const result = FixtureFactoryImpl.createInstance(recipe);

        expect(result).toBeTruthy();
      });
    });

    describe("With ctx provided", () => {
      it("should return a <FixtureFactory>", () => {
        const recipe = new FixtureRecipeImpl(() => ({}));

        const result = FixtureFactoryImpl.createInstance(recipe, new FactoryContext());

        expect(result).toBeTruthy();
      });
    });
  });

  describe(FixtureFactoryImpl.prototype.withVariants, () => {
    let mockConsoleWarn: jest.SpyInstance;

    beforeEach(() => {
      mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should create a new instance of <FixtureFactoryImpl>", () => {
      const mainRecipe = new FixtureRecipeImpl(() => ({ id: 1, name: "foo" }));
      const variant = new FixtureRecipeImpl(() => ({ id: 2, name: "bar" }));
      const instance = new FixtureFactoryImpl(mainRecipe, new FactoryContext());

      const result = instance.withVariants(variant);

      expect(result).not.toBe(instance);
      expect(mockConsoleWarn).not.toHaveBeenCalled();
    });

    describe("No variants provided", () => {
      it("should log a warning ", () => {
        const mainRecipe = new FixtureRecipeImpl(() => ({ id: 1, name: "foo" }));
        const instance = new FixtureFactoryImpl(mainRecipe, new FactoryContext());

        const result = instance.withVariants();

        expect(result).not.toBe(instance);
        expect(mockConsoleWarn).toHaveBeenCalledWith("<JsFixture> - No variants provided to `withVariants()`.");
      });
    });
  });

  describe(FixtureFactoryImpl.prototype.create.name, () => {
    let instance: FixtureFactoryImpl<Foo>;
    let recipe: FixtureRecipeImpl<Foo>;
    let factoryCtx: FactoryContext;

    beforeEach(() => {
      recipe = new FixtureRecipeImpl(() => ({ id: 10, name: "foo" }));
      factoryCtx = new FactoryContext();
      instance = new FixtureFactoryImpl(recipe, factoryCtx);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it("should create a new fixture", () => {
      const expected = { key: faker.string.alpha() };
      draftToFixtureMock.mockReturnValue(expected);

      const result = instance.create();

      expect(result).toEqual(expected);
      expect(createDraftMock).toHaveBeenCalledWith(factoryCtx, recipe, {});
    });

    describe("with overrides", () => {
      it("should create a new fixture", () => {
        const override = () => ({ name: "bar" });
        const expected = { key: faker.string.alpha() };
        draftToFixtureMock.mockReturnValue(expected);

        const result = instance.create(override);

        expect(result).toEqual(expected);
        expect(createDraftMock).toHaveBeenCalledWith(factoryCtx, recipe, createOptions(undefined, override));
      });
    });

    describe("with variants", () => {
      it("should create a new fixture", () => {
        const variant1 = new FixtureRecipeImpl(() => ({ id: 2, name: "foo2" }));
        const variant2 = new FixtureRecipeImpl(() => ({ id: 3, name: "foo3" }));
        const overrideFn = () => ({ name: "bar" });
        const instanceWithVariants = instance.withVariants(variant1, variant2);
        const expected = { key: faker.string.alpha() };
        draftToFixtureMock.mockReturnValue(expected);

        const result = instanceWithVariants.create(overrideFn);

        expect(result).toEqual(expected);
        expect(createDraftMock).toHaveBeenCalledWith(factoryCtx, recipe, createOptions([variant1, variant2], overrideFn));
      });
    });
  });

  describe(FixtureFactoryImpl.prototype.createMany.name, () => {
    let instance: FixtureFactoryImpl<Foo>;
    let recipe: FixtureRecipeImpl<Foo>;
    let factoryCtx: FactoryContext;

    beforeEach(() => {
      recipe = new FixtureRecipeImpl(() => ({ id: 10, name: "foo" }));
      factoryCtx = new FactoryContext();
      instance = new FixtureFactoryImpl(recipe, factoryCtx);
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it("should create a random number of fixtures when no length was specified", () => {
      const length = 3;
      getNumberBetweenMock.mockReturnValue(length);
      draftToFixtureMock
        .mockReturnValueOnce({ foo: "bar1" })
        .mockReturnValueOnce({ foo: "bar2" })
        .mockReturnValueOnce({ foo: "bar3" });

      const result = instance.createMany();

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
      expect(result[2]).toEqual({ foo: "bar3" });
      expect(createDraftMock).toHaveBeenCalledWith(factoryCtx, recipe, {});
    });

    it("should create the correct number of fixtures when `length` is specified", () => {
      const length = 2;
      draftToFixtureMock.mockReturnValueOnce({ foo: "bar1" }).mockReturnValueOnce({ foo: "bar2" });

      const result = instance.createMany(length);

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
      expect(createDraftMock).toHaveBeenCalledWith(factoryCtx, recipe, {});
    });

    it("should create fixtures that all have the specified overrides when `overrideFn` is provided", () => {
      const length = 2;
      getNumberBetweenMock.mockReturnValue(length);

      const overrideFn = () => ({ name: "bar_override" });
      draftToFixtureMock.mockReturnValueOnce({ foo: "bar1" }).mockReturnValueOnce({ foo: "bar2" });

      const result = instance.createMany(overrideFn);

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
      expect(createDraftMock).toHaveBeenCalledWith(factoryCtx, recipe, createOptions(undefined, overrideFn));
      expect(draftToFixtureMock).toHaveBeenCalledTimes(2);
    });

    it("should create the requested number of fixtures that all have the specified overrides when `length` and `overrideFn` are provided", () => {
      const length = 3;

      const override = () => ({ name: "bar_override" });
      draftToFixtureMock
        .mockReturnValueOnce({ foo: "bar1" })
        .mockReturnValueOnce({ foo: "bar2" })
        .mockReturnValueOnce({ foo: "bar3" });

      const result = instance.createMany(length, override);

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
      expect(result[2]).toEqual({ foo: "bar3" });
      expect(createDraftMock).toHaveBeenCalledWith(factoryCtx, recipe, createOptions(undefined, override));
      expect(draftToFixtureMock).toHaveBeenCalledTimes(3);
    });
  });
});
