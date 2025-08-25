import { Context, FixtureFactory, FixtureRecipe } from "types";
import { ContextualValue, LazyValue } from "types/internal";
import { contextualValue, lazyValue } from "utils/internal";
import { FactoryContext } from "./fixture-factory";

/**
 * Fixture-building context exposed by the public API when defining a recipe or creating a fixture.
 */
export class ContextImpl<TFixture> implements Context<TFixture> {
  private _draft: { instance: TFixture | null } = { instance: null };

  /**
   * Internal. Sets the draft instance that will be used to resolve contextual values.
   */
  public set draft(value: TFixture | null) {
    this._draft.instance = value;
  }

  constructor(private readonly factoryContext: FactoryContext) {}

  /**
   * Returns a lazily evaluated auto-incrementing number.
   *
   * @param key - Optional key to namespace the counter. If omitted, uses a global counter.
   * @returns A lazy value that, when resolved, yields the next increment.
   */
  autoIncrement(key?: string): number | LazyValue<number> {
    return lazyValue(() => this.factoryContext.getNextIncrement(key));
  }

  /**
   * Returns a lazily evaluated contextual value that is based on the fixture (draft) being created.
   *
   * @param fn - A function that derives a value from the fixture draft.
   * @returns A contextual value, which will be resolved later with the draft instance.
   */
  contextualValue<TValue>(fn: (fixture: TFixture) => TValue): ContextualValue<TFixture, TValue> {
    return contextualValue(fn, this._draft);
  }

  /**
   * Creates (or retrieves) a factory for a given recipe.
   *
   * @param recipe - The fixture recipe definition.
   * @returns A factory capable of producing fixtures from the recipe.
   */
  fromRecipe<TFixture>(recipe: FixtureRecipe<TFixture>): FixtureFactory<TFixture> {
    return this.factoryContext.getOrCreateFactory(recipe);
  }
}
