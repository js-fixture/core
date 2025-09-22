import { FixtureFactoryImpl, FixtureRecipeImpl } from "core/internal";
import { placeholderValue } from "utils/internal";

interface Foo {
  id: number;
  name: string;
}

describe(FixtureRecipeImpl.name, () => {
  let createInstanceSpy: jest.SpyInstance;

  beforeEach(() => {
    createInstanceSpy = jest.spyOn(FixtureFactoryImpl, "createInstance");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(FixtureRecipeImpl.prototype.variant, () => {
    describe("Variant is an object", () => {
      it("should return a new instance", () => {
        const recipe = () => ({ id: 10, name: "foo" });
        const instance = new FixtureRecipeImpl<Foo>(recipe);
        const override = {
          name: "bar",
        };

        const result = instance.variant(override) as FixtureRecipeImpl<Foo>;

        expect(result.baseObject).toEqual({ id: 10, name: "foo" });
        expect(result.override).toEqual(override);
      });
    });

    describe("Variant is a function", () => {
      it("should return a new instance", () => {
        const recipe = () => ({ id: 10, name: "foo" });
        const instance = new FixtureRecipeImpl<Foo>(recipe);
        const override = jest.fn();
        override.mockReturnValue({
          name: "Paul",
          address: {
            line2: undefined,
            country: "FR",
          },
        });

        const result = instance.variant(override) as FixtureRecipeImpl<Foo>;

        expect(result.baseObject).toEqual({ id: 10, name: "foo" });
        expect(result.override).toEqual({
          name: "Paul",
          address: {
            line2: undefined,
            country: "FR",
          },
        });
      });
    });
  });

  describe(FixtureRecipeImpl.prototype.createFactory.name, () => {
    it("should create a new <FixtureFactory> from the current recipe", () => {
      const recipe = () => ({ id: 10, name: "foo" });
      const instance = new FixtureRecipeImpl<Foo>(recipe);
      const expected = jest.fn();
      createInstanceSpy.mockReturnValue(expected);

      const result = instance.createFactory();

      expect(result).toBe(expected);
    });
  });

  describe(FixtureRecipeImpl.prototype.draft.name, () => {
    it("should resolve placeholder values", () => {
      const mock1 = jest.fn().mockReturnValue(111);
      const mock2 = jest.fn().mockReturnValue(222);
      const recipe = () => ({
        var1: 1,
        var2: placeholderValue(mock1, "UUID"),
        nested1: {
          var1: 1,
          var2: 2,
          var3: placeholderValue(mock2, "UUID"),
        },
      });
      const instance = new FixtureRecipeImpl(recipe);
      const ctx = jest.fn() as any;

      const result = instance.draft(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: 111,
        nested1: {
          var1: 1,
          var2: 2,
          var3: 222,
        },
      });
      expect(mock1).toHaveBeenCalledWith(ctx);
      expect(mock2).toHaveBeenCalledWith(ctx);
    });

    it("should have overrides take precedence over recipe values", () => {
      const recipe = () => ({
        var1: 1,
        var2: "var2",
        var3: "var3",
      });
      const override = {
        var2: "overriden var 2",
      };
      const instance = new FixtureRecipeImpl(recipe, override);
      const ctx = jest.fn() as any;

      const result = instance.draft(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: "overriden var 2",
        var3: "var3",
      });
    });

    it("should correctly handle Date properties", () => {
      const recipe = () => ({
        var1: 1,
        var2: new Date(2025, 12, 12),
      });
      const instance = new FixtureRecipeImpl(recipe);
      const ctx = jest.fn() as any;

      const result = instance.draft(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: new Date(2025, 12, 12),
      });
    });

    it("should correctly handle arrays", () => {
      const recipe = () => ({
        var1: 1,
        var2: [1, "test"],
      });
      const instance = new FixtureRecipeImpl(recipe);
      const ctx = jest.fn() as any;

      const result = instance.draft(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: [1, "test"],
      });
    });
  });

  describe(FixtureRecipeImpl.prototype.draftAsVariant.name, () => {
    it("should resolve placeholder values", () => {
      const mock1 = jest.fn().mockReturnValue(111);
      const mock2 = jest.fn().mockReturnValue(222);
      const override = {
        var1: 1,
        var2: placeholderValue(mock1, "uuid"),
        nested1: {
          var1: 1,
          var2: 2,
          var3: placeholderValue(mock2, "uuid"),
        },
      };
      const originalRecipe = new FixtureRecipeImpl(() => ({ var1: 0 }));
      const instance = originalRecipe.variant(override) as FixtureRecipeImpl<any>;

      const ctx = jest.fn() as any;

      const result = instance.draft(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: 111,
        nested1: {
          var1: 1,
          var2: 2,
          var3: 222,
        },
      });
      expect(mock1).toHaveBeenCalledWith(ctx);
      expect(mock2).toHaveBeenCalledWith(ctx);
    });

    it("should correctly handle Date properties", () => {
      const override = {
        var1: 1,
        var2: new Date(2025, 12, 12),
      };
      const instance = new FixtureRecipeImpl(() => ({ var1: 0 }), override);
      const ctx = jest.fn() as any;

      const result = instance.draft(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: new Date(2025, 12, 12),
      });
    });

    it("should correctly handle arrays", () => {
      const override = {
        var1: 1,
        var2: [1, "test"],
      };
      const instance = new FixtureRecipeImpl(() => ({ var1: 0 }), override);
      const ctx = jest.fn() as any;

      const result = instance.draft(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: [1, "test"],
      });
    });
  });
});
