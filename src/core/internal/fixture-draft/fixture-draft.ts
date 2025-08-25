import { isContextualValue, isLazy } from "utils/internal";

/**
 * Represents a draft of a fixture. Drafts are an intermediate step before producing a fully resolved fixture.
 */
export class FixtureDraft<TFixture> {
  constructor(
    public readonly draft: TFixture,
    public readonly isBaseDraft: boolean,
  ) {}

  /**
   * Resolves the draft into a finalized fixture by replacing all deferred values
   * (e.g., lazy or contextual) with their real values.
   *
   * @returns {TFixture} - The fully resolved fixture.
   */
  toFixture(): TFixture {
    return this.resolveLayer(this.isBaseDraft, this.draft, this.draft) as TFixture;
  }

 /**
   * Recursively resolves all deferred values (lazy/contextual) within an object or array.
   *
   * @param isBaseDraft - Whether this draft is the base draft (controls resolution rules for lazy values).
   * @param draft - The root draft object (passed down for context).
   * @param obj - The current object/value being resolved.
   * @returns {unknown} - A new object/value with deferred values resolved.
   */
  private resolveLayer<TFixture>(isBaseDraft: boolean, draft: TFixture, obj: unknown): unknown {
    if (isBaseDraft && isLazy(obj)) {
      return obj.get();
    }

    if (isContextualValue(obj)) {
      return obj.get();
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.resolveLayer(isBaseDraft, draft, item));
    }

    if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, this.resolveLayer(isBaseDraft, draft, value)]),
      );
    }

    return obj;
  }
}
