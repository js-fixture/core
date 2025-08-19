import { FactoryContext, FixtureFactory, FixtureRecipe } from "types";
import { AutoCounter } from "./auto-counter";
import { lazy } from "utils/internal";
import { LazyValue } from "types/internal";
import { FixtureFactoryImpl } from "../fixture-factory";
import { FixtureRecipeImpl } from "../fixture-recipe";
import { FactoryDepthTracker } from "./factory-depth-tracker";

export class FactoryContextImpl implements FactoryContext {
  private readonly autoCounter = new AutoCounter();
  private readonly registeredFactories = new Map<FixtureRecipe<unknown>, FixtureFactory<unknown>>();

  public readonly session: FactoryDepthTracker;

  constructor();
  constructor(session: FactoryDepthTracker);
  constructor(session?: FactoryDepthTracker) {
    this.session = session || new FactoryDepthTracker();
  }

  autoIncrement(key?: string): number | LazyValue<number> {
    return lazy(() => this.autoCounter.getNextValue(key));
  }

  fromRecipe<T>(recipe: FixtureRecipe<T>): FixtureFactory<T> {
    let factory = this.registeredFactories.get(recipe);

    if (!factory) {
      factory = FixtureFactoryImpl.createInstance(recipe as FixtureRecipeImpl<T>, new FactoryContextImpl(this.session));
      this.registeredFactories.set(recipe, factory);
    }

    return factory as FixtureFactory<T>;
  }
}
