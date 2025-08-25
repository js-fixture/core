import { FixtureFactory, FixtureRecipe } from "types";
import { AutoCounter } from "./auto-counter";
import { FactoryDepthTracker } from "./factory-depth-tracker";
import { FixtureRecipeImpl } from "../../fixture-recipe";
import { FixtureFactoryImpl } from "../fixture-factory";

export class FactoryContext {
  private readonly autoCounter = new AutoCounter();
  private readonly registeredFactories = new Map<FixtureRecipe<unknown>, FixtureFactory<unknown>>();

  public readonly depthTracker: FactoryDepthTracker;

  constructor(depthTracker?: FactoryDepthTracker) {
    this.depthTracker = depthTracker || new FactoryDepthTracker();
  }

  getNextIncrement(key?: string): number {
    return this.autoCounter.getNextValue(key);
  }

  getOrCreateFactory<TFixture>(recipe: FixtureRecipe<TFixture>): FixtureFactory<TFixture> {
    let factory = this.registeredFactories.get(recipe);

    if (!factory) {
      factory = FixtureFactoryImpl.createInstance(recipe as FixtureRecipeImpl<TFixture>, new FactoryContext(this.depthTracker));
      this.registeredFactories.set(recipe, factory);
    }

    return factory as FixtureFactory<TFixture>;
  }
}
