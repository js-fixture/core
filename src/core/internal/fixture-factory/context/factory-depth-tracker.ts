/**
 * Tracks the nesting depth of factories during fixture creation.
 *
 * Used to distinguish between the outermost (base) draft and nested drafts
 * created via `fromRecipe()`. This is important for resolving lazy values
 * consistently (e.g., lazy values only resolve at the base draft).
 */
export class FactoryDepthTracker {
  private _depth = 0;

  /**
   * Indicates whether the current draft is the base draft (outermost factory).
   */
  get isBaseDraft(): boolean {
    return this._depth <= 1;
  }

  /**
   * Increments the depth when entering a drafting mode
   * (i.e., starting a new fixture draft).
   */
  startDraftingMode(): void {
    this._depth++;
  }

  /**
   * Decrements the depth when leaving drafting mode
   * (i.e., finishing a fixture draft).
   */
  exitDraftingMode(): void {
    this._depth--;
  }
}