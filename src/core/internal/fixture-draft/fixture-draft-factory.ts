import { DraftOptions } from "types/internal";
import { ContextImpl } from "../context/context";
import { FactoryContext } from "../fixture-factory";
import { FixtureRecipeImpl } from "../fixture-recipe";
import { FixtureDraft } from "./fixture-draft";
import { forceMerge } from "utils/internal";

/**
 * Factory for creating draft fixtures.
 */
export class FixtureDraftFactory {
  /**
   * Creates a fixture draft by combining a recipe with optional variants and overrides.
   *
   * @param {FactoryContext} factoryCtx - Shared factory context.
   * @param {FixtureRecipeImpl<TFixture>} recipe - The base fixture recipe.
   * @param {DraftOptions<TFixture>} options - Options for customizing the draft.
   * @returns {FixtureDraft<TFixture>} - A new draft fixture instance.
   */
  create<TFixture>(
    factoryCtx: FactoryContext,
    recipe: FixtureRecipeImpl<TFixture>,
    options: DraftOptions<TFixture>,
  ): FixtureDraft<TFixture> {
    const ctx = new ContextImpl<TFixture>(factoryCtx);

    // Must start tracking the current drafting session to ensure that lazy values are only resolved when building the main fixture, not nested ones
    factoryCtx.depthTracker.startDraftingMode();

    let draft = recipe.draftFixture(ctx);
    for (const variant of options.variants ?? []) {
      draft = forceMerge(draft, variant.getResolvedOverride(ctx));
    }

    if (options.overrideDraft) {
      draft = forceMerge(draft, options.overrideDraft(ctx));
    }

    ctx.draft = draft as TFixture;
    const isBaseDraft = factoryCtx.depthTracker.isBaseDraft;

    factoryCtx.depthTracker.exitDraftingMode();

    return new FixtureDraft(draft as TFixture, isBaseDraft);
  }
}