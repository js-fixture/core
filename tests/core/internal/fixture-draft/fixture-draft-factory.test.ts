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
        const result = instance.create(ctx, new FixtureRecipeImpl(() => ({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] })), {});

        expect(result.isBaseDraft).toBe(true);
        expect(result.draft).toEqual({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] });
      });
    });

    describe("Is not base draft", () => {
      it("should return a draft marked as not a base draft", () => {
        ctx.depthTracker.startDraftingMode();
        const result = instance.create(ctx, new FixtureRecipeImpl(() => ({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] })), {});
        ctx.depthTracker.exitDraftingMode();

        expect(result.isBaseDraft).toBe(false);
        expect(result.draft).toEqual({ prop1: 10, prop2: "foo", array: [1, 2, 3, 4] });
      });
    });

    describe("No variants, no overrides", () => {
      it("should return the draft created from the recipe", () => {
        const recipe = new FixtureRecipeImpl(() => ({ prop1: 123 }));
        const result = instance.create(ctx, recipe, {});

        expect(result.draft).toEqual({ prop1: 123 });
      });
    });

    describe("One variant applied", () => {
      it("should return a draft where the variant overrides the recipe's values", () => {
        const recipe = new FixtureRecipeImpl(() => ({ prop1: "Recipe - Will be overridden", prop2: "Recipe" }));
        const variant = recipe.variant({ prop1: "Overriden by variant" }) as FixtureRecipeImpl<any>;

        const result = instance.create(ctx, recipe, createOptions([variant]));

        expect(result.draft).toEqual({ prop1: "Overriden by variant", prop2: "Recipe" });
      });

      it("should let the variant's undefined values override non-undefined source values", () => {
        const recipe = new FixtureRecipeImpl(() => ({ prop1: "Recipe - Will be overridden", prop2: "Recipe" }));
        const variant = recipe.variant({ prop1: undefined }) as FixtureRecipeImpl<any>;

        const result = instance.create(ctx, recipe, createOptions([variant]));

        expect(result.draft).toEqual({ prop1: undefined, prop2: "Recipe" });
      });
    });

    describe("Multiple variants applied", () => {
      it("should return a draft where the last variant overrides the previous ones, and the recipe's values", () => {
        const recipe = new FixtureRecipeImpl(() => ({ prop1: "Recipe - Will be overridden", prop2: "Recipe", variant: "" }));
        const variant1 = recipe.variant({
          prop1: "variant1 - Will be overridden",
          variant: "variant1",
        }) as FixtureRecipeImpl<any>;
        const variant2 = recipe.variant({ prop1: "Overridden by variant2" }) as FixtureRecipeImpl<any>;

        const result = instance.create(ctx, recipe, createOptions([variant1, variant2]));

        expect(result.draft).toEqual({ prop1: "Overridden by variant2", prop2: "Recipe", variant: "variant1" });
      });
    });

    describe("With instance-specific overrides", () => {
      it("should return a draft where the overrides override the recipe's values", () => {
        const recipe = new FixtureRecipeImpl(() => ({ prop1: "Recipe", prop2: "Recipe - Will be overridden" }));

        const result = instance.create(
          ctx,
          recipe,
          createOptions([], () => ({ prop2: "Overridden" })),
        );

        expect(result.draft).toEqual({ prop1: "Recipe", prop2: "Overridden" });
      });

      it("should let the override's undefined values override non-undefined source values", () => {
        const recipe = new FixtureRecipeImpl(() => ({ prop1: "Recipe", prop2: "Recipe - Will be overridden" }));

        const result = instance.create(
          ctx,
          recipe,
          createOptions([], () => ({ prop2: undefined })),
        );

        expect(result.draft).toEqual({ prop1: "Recipe", prop2: undefined });
      });
    });

    describe("With all possible kinds of overrides", () => {
      it("should return a draft where the instance-specific overrides have priority, followed by factory variants, followed by recipe variant", () => {
        const recipe = new FixtureRecipeImpl(() => ({
          prop1: "Recipe - Will be overridden",
          prop2: "Recipe - Will be overridden",
          prop3: "Recipe",
          prop4: "Recipe",
        }));
        const variant1 = recipe.variant({
          prop1: "Variant 1 - Will be overridden",
          prop2: "Variant 1",
        }) as FixtureRecipeImpl<any>;

        const result = instance.create(
          ctx,
          recipe,
          createOptions([variant1], () => ({ prop1: "Instance Override" })),
        );

        expect(result.draft).toEqual({
          prop1: "Instance Override",
          prop2: "Variant 1",
          prop3: "Recipe",
          prop4: "Recipe",
        });
      });
    });
  });
});
