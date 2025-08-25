import { FactoryContext, FixtureFactory, FixtureRecipe } from "types";
import { AutoCounter } from "./auto-counter";
import { lazyValue } from "utils/internal";
import { ContextualValue, LazyValue } from "types/internal";
import { FixtureFactoryImpl } from "../fixture-factory";
import { FixtureRecipeImpl } from "../fixture-recipe";
import { FactoryDepthTracker } from "./factory-depth-tracker";
import { contextualValue } from "src/utils/internal/contextual";

export class FactoryContextImpl<TFixture> implements FactoryContext<TFixture> {
  private readonly autoCounter = new AutoCounter();
  private readonly registeredFactories = new Map<FixtureRecipe<unknown>, FixtureFactory<unknown>>();
  public currentFixture: { instance: TFixture | null } = { instance: null };

  public set fixture(value: TFixture) {
    this.currentFixture.instance = value;
  }

  public readonly session: FactoryDepthTracker;

  constructor();
  constructor(session: FactoryDepthTracker);
  constructor(session?: FactoryDepthTracker) {
    this.session = session || new FactoryDepthTracker();
  }

  autoIncrement(key?: string): number | LazyValue<number> {
    return lazyValue(() => this.autoCounter.getNextValue(key));
  }

  contextualValue<TValue>(fn: (fixture: TFixture) => TValue): ContextualValue<TFixture, TValue> {
    return contextualValue(fn, this.currentFixture);
  }

  fromRecipe<TRecipe>(recipe: FixtureRecipe<TRecipe>): FixtureFactory<TRecipe> {
    let factory = this.registeredFactories.get(recipe);

    if (!factory) {
      factory = FixtureFactoryImpl.createInstance(recipe as FixtureRecipeImpl<TRecipe>, new FactoryContextImpl(this.session));
      this.registeredFactories.set(recipe, factory);
    }

    return factory as FixtureFactory<TRecipe>;
  }
}
