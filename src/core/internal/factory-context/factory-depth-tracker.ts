/**
 * Keeps track of how deep the current factory being used to create a fixture is.
 * 
 * @example
 * ```typescript
 * const userRecipe = JsFixture.defineRecipe<User>((ctx) => ({
 *   id: ctx.autoIncrement(), // <- 1st level - Outermost
 *   name: 'Alice', // <- 1st level - Outermost
 *   profile: ctx.fromRecipe(profileRecipe).create() // <- 2nd level
 * }));
 * ```
 */
export class FactoryDepthTracker {
  private _depth = 0;

  get isOutermostFactory() {
    return this._depth <= 1;
  }

  enterCreationMode(): void {
    this._depth++;
  }

  exitCreationMode(): void {
    this._depth--;
  }
}