import { FixtureFactoryImpl, FixtureRecipeImpl, FactoryContextImpl } from "core/internal";
import { getNumberBetween } from "utils/internal";

jest.mock("src/utils/internal/get-number-between");

const getNumberBetweenMock = jest.mocked(getNumberBetween);

interface Foo {
  id: number;
  name: string;
}

describe(FixtureFactoryImpl.name, () => {
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

        const result = FixtureFactoryImpl.createInstance(recipe, new FactoryContextImpl());

        expect(result).toBeTruthy();
      });
    });
  });

  describe(FixtureFactoryImpl.prototype.withVariants, () => {
    it("should create a new instance of <FixtureFactoryImpl>", () => {
      const mainRecipe = new FixtureRecipeImpl(() => ({ id: 1, name: "foo" }));
      const variant = new FixtureRecipeImpl(() => ({ id: 2, name: "bar" }));
      const instance = new FixtureFactoryImpl(mainRecipe, new FactoryContextImpl());
      mainRecipe.createFixture = jest.fn().mockReturnValue({ foo: "bar" });

      const result = instance.withVariants(variant);

      expect(result).not.toBe(instance);
    });

    describe('No variants provided', () => {
      let mockConsoleWarn: jest.SpyInstance
      beforeEach(() => {
        mockConsoleWarn = jest.spyOn(console, 'warn');
      });



    it("should log a warning ", () => {
      const mainRecipe = new FixtureRecipeImpl(() => ({ id: 1, name: "foo" }));
      const instance = new FixtureFactoryImpl(mainRecipe, new FactoryContextImpl());
      mainRecipe.createFixture = jest.fn().mockReturnValue({ foo: "bar" });

      const result = instance.withVariants();

      expect(result).not.toBe(instance);
      expect(mockConsoleWarn).toHaveBeenCalledWith('<JsFixture> - No variants provided to `withVariants()`.')

    });
    });
  });

  describe(FixtureFactoryImpl.prototype.create.name, () => {
    let instance: FixtureFactoryImpl<Foo>;
    let recipe: FixtureRecipeImpl<Foo>;

    beforeEach(() => {
      recipe = new FixtureRecipeImpl(() => ({ id: 10, name: "foo" }));
      instance = new FixtureFactoryImpl(recipe, new FactoryContextImpl());
    });

    it("should create a new fixture", () => {
      recipe.createFixture = jest.fn().mockReturnValue({ foo: "bar" });

      const result = instance.create();

      expect(result).toEqual({ foo: "bar" });
      expect(recipe.createFixture).toHaveBeenCalledWith(expect.any(FactoryContextImpl), {});
    });

    describe("with overrides", () => {
      it("should create a new fixture", () => {
        const override = () => ({ name: "bar" });
        recipe.createFixture = jest.fn().mockReturnValue({ foo: "bar" });

        const result = instance.create(override);

        expect(result).toEqual({ foo: "bar" });
        expect(recipe.createFixture).toHaveBeenCalledWith(expect.any(FactoryContextImpl), { buildOverride: override});
      });
    });

    describe("with variants", () => {
      it("should create a new fixture", () => {
        const variant1 = new FixtureRecipeImpl(() => ({ id: 2, name: "foo2" }));
        const variant2 = new FixtureRecipeImpl(() => ({ id: 3, name: "foo3" }));
        const buildOverride = () => ({ name: "bar" });
        recipe.createFixture = jest.fn().mockReturnValue({ foo: "bar" });

        const instanceWithVariants = instance.withVariants(variant1, variant2);
        const result = instanceWithVariants.create(buildOverride);

        expect(result).toEqual({ foo: "bar" });
        expect(recipe.createFixture).toHaveBeenCalledWith(expect.any(FactoryContextImpl), {
          variants: [variant1, variant2],
          buildOverride,
        });
      });
    });
  });

  describe(FixtureFactoryImpl.prototype.createMany.name, () => {
    let instance: FixtureFactoryImpl<Foo>;
    let recipe: FixtureRecipeImpl<Foo>;

    beforeEach(() => {
      recipe = new FixtureRecipeImpl(() => ({ id: 10, name: "foo" }));
      instance = new FixtureFactoryImpl(recipe, new FactoryContextImpl());
    });

    it("should create a random number of fixtures when no length was specified", () => {
      const length = 3;
      getNumberBetweenMock.mockReturnValue(length);
      recipe.createFixture = jest
        .fn()
        .mockReturnValueOnce({ foo: "bar1" })
        .mockReturnValueOnce({ foo: "bar2" })
        .mockReturnValueOnce({ foo: "bar3" });

      const result = instance.createMany();

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
      expect(result[2]).toEqual({ foo: "bar3" });
    });

    it("should create `length` elements when `length` is specified", () => {
      const length = 2;
      recipe.createFixture = jest.fn().mockReturnValueOnce({ foo: "bar1" }).mockReturnValueOnce({ foo: "bar2" });

      const result = instance.createMany(length);

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
    });

    it("should create fixtures with specified overrides when `overrides` is provided", () => {
      const length = 2;
      getNumberBetweenMock.mockReturnValue(length);

      const override = () => ({ name: "bar_override" });
      recipe.createFixture = jest.fn().mockReturnValueOnce({ foo: "bar1" }).mockReturnValueOnce({ foo: "bar2" });

      const result = instance.createMany(override);

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
      expect(recipe.createFixture).toHaveBeenCalledTimes(2);
      expect(recipe.createFixture).toHaveBeenCalledWith(expect.any(FactoryContextImpl), { buildOverride: override});
    });

    it("should create `length` fixtures with specified overrides when `length` and `overrides` are provided", () => {
      const length = 3;

      const override = () => ({ name: "bar_override" });
      recipe.createFixture = jest
        .fn()
        .mockReturnValueOnce({ foo: "bar1" })
        .mockReturnValueOnce({ foo: "bar2" })
        .mockReturnValueOnce({ foo: "bar3" });

      const result = instance.createMany(length, override);

      expect(result.length).toBe(length);
      expect(result[0]).toEqual({ foo: "bar1" });
      expect(result[1]).toEqual({ foo: "bar2" });
      expect(result[2]).toEqual({ foo: "bar3" });
      expect(recipe.createFixture).toHaveBeenCalledTimes(3);
      expect(recipe.createFixture).toHaveBeenCalledWith(expect.any(FactoryContextImpl), { buildOverride: override});
    });
  });
});
