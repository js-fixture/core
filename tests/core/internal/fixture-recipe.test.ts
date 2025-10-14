import { FixtureFactoryImpl, FixtureRecipeImpl } from "core/internal";

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

        expect(result.createFixture).toEqual(recipe);
        expect(result.override).toEqual(override);
      });
    });

    describe("Variant is a function", () => {
      it("should return a new instance", () => {
        const recipe = () => ({ id: 10, name: "foo" });
        const instance = new FixtureRecipeImpl<Foo>(recipe);
        const override = jest.fn();

        const result = instance.variant(override) as FixtureRecipeImpl<Foo>;

        expect(result.createFixture).toEqual(recipe);
        expect(result.override).toEqual(override);
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

  describe(FixtureRecipeImpl.prototype.draftFixture.name, () => {
    it("should return the draft of the fixture when there are no overrides", () => {
      const recipe = new FixtureRecipeImpl(() => ({
        var1: 1,
        var2: "var2",
        var3: "var3",
      }));

      const ctx = jest.fn() as any;

      const result = recipe.draftFixture(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: "var2",
        var3: "var3",
      });
    });

    it("should have Object overrides take precedence over recipe values", () => {
      const recipe = new FixtureRecipeImpl(() => ({
        var1: 1,
        var2: "var2",
        var3: "var3",
      }));
      const variant = recipe.variant({
        var2: "overriden var 2",
      }) as FixtureRecipeImpl<any>;

      const ctx = jest.fn() as any;

      const result = variant.draftFixture(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: "overriden var 2",
        var3: "var3",
      });
    });

    it("should have Function overrides take precedence over recipe values", () => {
      const recipe = new FixtureRecipeImpl(() => ({
        var1: 1,
        var2: "var2",
        var3: "var3",
      }));
      const variant = recipe.variant(() => ({
        var2: "overriden var 2",
      })) as FixtureRecipeImpl<any>;

      const ctx = jest.fn() as any;

      const result = variant.draftFixture(ctx);

      expect(result).toEqual({
        var1: 1,
        var2: "overriden var 2",
        var3: "var3",
      });
    });
  });

  describe(FixtureRecipeImpl.prototype.getResolvedOverride.name, () => {
    it("should return undefined when there are no overrides", () => {
      const recipe = new FixtureRecipeImpl(() => ({
        var1: 1,
        var2: "var2",
        var3: "var3",
      }));

      const ctx = jest.fn() as any;

      const result = recipe.getResolvedOverride(ctx);

      expect(result).toEqual(undefined);
    });

    it("should return Object overrides as-is", () => {
      const recipe = new FixtureRecipeImpl(() => ({
        var1: 1,
        var2: "var2",
        var3: "var3",
      }));
      const variant = recipe.variant({
        var2: "overriden var 2",
      }) as FixtureRecipeImpl<any>;

      const ctx = jest.fn() as any;

      const result = variant.getResolvedOverride(ctx);

      expect(result).toEqual({
        var2: "overriden var 2"
      });
    });

    it("should resolve Function overrides to return their values", () => {
      const recipe = new FixtureRecipeImpl(() => ({
        var1: 1,
        var2: "var2",
        var3: "var3",
      }));
      const variant = recipe.variant(() => ({
        var2: "overriden var 2",
      })) as FixtureRecipeImpl<any>;

      const ctx = jest.fn() as any;

      const result = variant.getResolvedOverride(ctx);

      expect(result).toEqual({
        var2: "overriden var 2"
      });
    });
  });
});
