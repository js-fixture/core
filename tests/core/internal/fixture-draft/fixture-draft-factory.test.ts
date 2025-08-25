import { FactoryContext, FixtureDraftFactory, FixtureRecipeImpl } from "core/internal";
import { DraftOptions, OverrideFunction } from "types/internal";

function createOptions(variants?: FixtureRecipeImpl<any>[], overrideFn?: OverrideFunction<any>): DraftOptions<any> {
  return { variants, overrideDraft: overrideFn };
}

describe(FixtureDraftFactory.name, () => {
  let instance: FixtureDraftFactory;
  let ctx: FactoryContext;

  beforeEach(() => {
    instance = new FixtureDraftFactory();
    ctx = new FactoryContext();
  });

  describe(FixtureDraftFactory.prototype.create.name, () => {
    describe("Is base draft", () => {
      it("should return a draft marked as being a base draft", () => {
        const result = instance.create(
          ctx,
          new FixtureRecipeImpl(() => ({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] })),
          {},
        );

        expect(result.isBaseDraft).toBe(true);
        expect(result.draft).toEqual({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] });
      });
    });

    describe("Is not base draft", () => {
      it("should return a draft marked as not a base draft", () => {
        ctx.depthTracker.startDraftingMode();
        const result = instance.create(
          ctx,
          new FixtureRecipeImpl(() => ({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] })),
          {},
        );
        ctx.depthTracker.exitDraftingMode();

        expect(result.isBaseDraft).toBe(false);
        expect(result.draft).toEqual({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] });
      });
    });

    describe("No variants, no overrides", () => {
      it("should return the draft created from the recipe", () => {
        const buildFunction = jest.fn().mockReturnValue({ prop1: 123 });
        const recipe = new FixtureRecipeImpl(buildFunction);
        const result = instance.create(ctx, recipe, {});

        expect(result.draft).toEqual({ prop1: 123 });
      });
    });

    describe("Recipe is a variant", () => {
      it("should return the draft created from the recipe", () => {
        const buildFunction = jest.fn().mockReturnValue({ prop1: "Recipe - Will be overridden", prop2: "Recipe" });
        const recipe = new FixtureRecipeImpl(buildFunction, { prop1: "Variant" });

        const result = instance.create(ctx, recipe, {});

        expect(result.draft).toEqual({ prop1: "Variant", prop2: "Recipe" });
      });
    });

    describe("One variant applied to the factory", () => {
      it("should return a draft where the variant overrides the recipe's values", () => {
        const buildFunction = jest.fn().mockReturnValue({ prop1: "Recipe - Will be overridden", prop2: "Recipe" });
        const recipe = new FixtureRecipeImpl(buildFunction);
        const variant = new FixtureRecipeImpl(jest.fn(), { prop1: "Overriden by variant" });

        const result = instance.create(ctx, recipe, createOptions([variant]));

        expect(result.draft).toEqual({ prop1: "Overriden by variant", prop2: "Recipe" });
      });
    });

    describe("Multiple variants applied to the factory", () => {
      it("should return a draft where the last variant overrides the previous ones, and the recipe's values", () => {
        const buildFunction = jest.fn().mockReturnValue({ prop1: "Recipe - Will be overridden", prop2: "Recipe" });
        const recipe = new FixtureRecipeImpl(buildFunction);
        const variant1 = new FixtureRecipeImpl(jest.fn(), { prop1: "variant1 - Will be overridden", variant: "variant1" });
        const variant2 = new FixtureRecipeImpl(jest.fn(), { prop1: "Overridden by variant2" });

        const result = instance.create(ctx, recipe, createOptions([variant1, variant2]));

        expect(result.draft).toEqual({ prop1: "Overridden by variant2", prop2: "Recipe", variant: "variant1" });
      });
    });

    describe("With instance-specific overrides", () => {
      it("should return a draft where the overrides override the recipe's values", () => {
        const buildFunction = jest.fn().mockReturnValue({ prop1: "Recipe", prop2: "Recipe - Will be overridden" });
        const recipe = new FixtureRecipeImpl(buildFunction);

        const result = instance.create(
          ctx,
          recipe,
          createOptions([], () => ({ prop2: "Overridden" })),
        );

        expect(result.draft).toEqual({ prop1: "Recipe", prop2: "Overridden" });
      });
    });

    describe("With all possible kinds of overrides", () => {
      it("should return a draft where the instance-specific overrides have priority, followed by factory variants, followed by recipe variant", () => {
        const buildFunction = jest.fn().mockReturnValue({
          prop1: "Recipe - Will be overridden",
          prop2: "Recipe - Will be overridden",
          prop3: "Recipe - Will be overridden",
          prop4: "Recipe",
        });
        const recipe = new FixtureRecipeImpl(buildFunction, {
          prop1: "Recipe Override - Will be overridden",
          prop2: "Recipe Override - Will be overridden",
          prop3: "Recipe Override",
        });
        const variant1 = new FixtureRecipeImpl(jest.fn(), { prop1: "Variant 1 - Will be overridden", prop2: "Variant 1" });

        const result = instance.create(
          ctx,
          recipe,
          createOptions([variant1], () => ({ prop1: "Instance Override" })),
        );

        expect(result.draft).toEqual({
          prop1: "Instance Override",
          prop2: "Variant 1",
          prop3: "Recipe Override",
          prop4: "Recipe",
        });
      });
    });
  });
});
