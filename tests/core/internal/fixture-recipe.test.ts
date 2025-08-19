import { FixtureFactoryImpl, FixtureRecipeImpl, FactoryContextImpl } from "core/internal";
import { lazy } from "utils/internal";

describe(FixtureRecipeImpl.name, () => {
  describe(FixtureRecipeImpl.prototype.variant, () => {
    it("should return a new instance", () => {
      const instance = new FixtureRecipeImpl(() => ({ id: 10, name: "foo" }));
      const result = instance.variant({ name: "bar" });

      expect(result).toBeTruthy();
      expect(result).not.toBe(instance);
    });
  });

  describe(FixtureRecipeImpl.prototype.createFactory.name, () => {
    it("should create a new <FixtureFactory> from the current recipe", () => {
      const instance = new FixtureRecipeImpl(() => ({ id: 10, name: "foo" }));

      const result = instance.createFactory();

      expect(result).toBeInstanceOf(FixtureFactoryImpl);
    });
  });

  describe(FixtureRecipeImpl.prototype.createFixture, () => {
    let ctx: FactoryContextImpl;

    beforeEach(() => {
      ctx = new FactoryContextImpl();
    });

    describe("Simple recipe", () => {
      it("should create a new fixture", () => {
        const instance = new FixtureRecipeImpl(() => ({ id: 10, name: "foo", array: [1, 2, 3, 4] }));

        const result = instance.createFixture(ctx, {});

        expect(result).toEqual({ id: 10, name: "foo", array: [1, 2, 3, 4] });
      });
    });

    describe("Recipe with nested properties", () => {
      it("should create a new fixture with all the nested properties", () => {
        const instance = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
          },
        }));

        const result = instance.createFixture(ctx, {});

        expect(result).toEqual({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
          },
        });
      });
    });

    describe("Recipe with lazy values", () => {
      it("should return a fixture with real values, not lazy ones", () => {
        const instance = new FixtureRecipeImpl(() => ({ id: lazy(() => 1), name: "foo" }));

        const result = instance.createFixture(ctx, {});

        expect(result).toEqual({ id: 1, name: "foo" });
      });
    });

    describe("Recipe with nested fixture (created from ctx)", () => {
      it("should create the fixture", () => {
        const fooRecipe = new FixtureRecipeImpl(() => ({ id: 1, foo_key: "foo" }));
        const instance = new FixtureRecipeImpl((ctx) => ({ id: 1, name: "foo", foo: ctx.fromRecipe(fooRecipe).create() }));

        const result = instance.createFixture(ctx, {});

        expect(result).toEqual({
          id: 1,
          name: "foo",
          foo: {
            id: 1,
            foo_key: "foo",
          },
        });
      });

      describe("With lazy values", () => {
        it("should create the fixture", () => {
          const fooRecipe = new FixtureRecipeImpl(() => ({ id: lazy(() => 2), foo_key: "foo" }));
          const instance = new FixtureRecipeImpl((ctx) => ({
            id: 1,
            name: lazy(() => "foo"),
            foo: ctx.fromRecipe(fooRecipe).create(),
          }));

          const result = instance.createFixture(ctx, {});

          expect(result).toEqual({
            id: 1,
            name: "foo",
            foo: {
              id: 2,
              foo_key: "foo",
            },
          });
        });

        describe("Lazy values are overriden", () => {
          it("should not resolve the overriden lazy values", () => {
            let fooCounter = 0;
            let barCounter = 0;
            const barRecipe = new FixtureRecipeImpl(() => ({
              barCounter: lazy(() => {
                barCounter++;
                return barCounter;
              }),
              foo_key: "foo",
            }));
            const fooRecipe = new FixtureRecipeImpl((ctx) => ({
              fooCounter: lazy(() => {
                fooCounter++;
                return fooCounter;
              }),
              name: "foo",
              foo: ctx.fromRecipe(barRecipe).create(),
            }));

            const resultWithOverride = fooRecipe.createFixture(ctx, { buildOverride: () => ({ fooCounter: 100 }) });

            expect(resultWithOverride).toEqual({
              fooCounter: 100,
              name: "foo",
              foo: {
                barCounter: 1,
                foo_key: "foo",
              },
            });

            const resultWithoutOverride = fooRecipe.createFixture(ctx, {});

            expect(resultWithoutOverride).toEqual({
              fooCounter: 1,
              name: "foo",
              foo: {
                barCounter: 2,
                foo_key: "foo",
              },
            });
          });
        });
      });
    });

    describe("With overrides", () => {
      it("should apply the overrides to the fixture", () => {
        const instance = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 1",
          },
        }));
        const override = { address: { line1: "Bar St" } };

        const result = instance.createFixture(ctx, { buildOverride: () => override });

        expect(result).toEqual({
          id: 10,
          name: "foo",
          address: {
            line1: "Bar St",
            line2: "App 1",
          },
        });
      });
    });

    describe("Is a variant of an original recipe", () => {
      it("should apply the variant's overrides to the fixture", () => {
        const instance = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 1",
          },
        }));

        const variant = instance.variant({ address: { line1: "Bar St" } }) as FixtureRecipeImpl<any>;

        const result = variant.createFixture(ctx, {});

        expect(result).toEqual({
          id: 10,
          name: "foo",
          address: {
            line1: "Bar St",
            line2: "App 1",
          },
        });
      });
    });

    describe("Is a variant with another variant applied", () => {
      it("should apply the (original) variant's overrides first, and then the variant'", () => {
        const original = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 1",
            zip: 5000,
          },
        }));

        const instance = original.variant({ address: { line1: "Bar St", line2: "App 2" } }) as FixtureRecipeImpl<any>;
        const variant1 = original.variant({ address: { line1: "Foo St" } }) as FixtureRecipeImpl<any>;

        const result = instance.createFixture(ctx, { variants: [variant1] });

        expect(result).toEqual({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 2",
            zip: 5000,
          },
        });
      });
    });

    describe("Is a variant of another variant", () => {
      it("should apply all the variants' overrides", () => {
        const instance = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 1",
            zip: 5000,
          },
        }));

        const variant1 = instance.variant({ address: { line1: "Bar St" } }) as FixtureRecipeImpl<any>;
        const variant2 = variant1.variant({ address: { line2: "App 2" } }) as FixtureRecipeImpl<any>;

        const result = variant2.createFixture(ctx, {});

        expect(result).toEqual({
          id: 10,
          name: "foo",
          address: {
            line1: "Bar St",
            line2: "App 2",
            zip: 5000,
          },
        });
      });
    });

    describe("With 1 variant", () => {
      it("should apply the variant's overrides to the fixture", () => {
        const instance = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 1",
          },
        }));

        const variant = instance.variant({ address: { line1: "Bar St" } }) as FixtureRecipeImpl<any>;

        const result = instance.createFixture(ctx, { variants: [variant] });

        expect(result).toEqual({
          id: 10,
          name: "foo",
          address: {
            line1: "Bar St",
            line2: "App 1",
          },
        });
      });
    });

    describe("With multiple variants", () => {
      it("should apply the variants in reverse order (last to first)'", () => {
        const original = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 1",
            zip: 5000,
          },
        }));

        const variant1 = original.variant({ address: { line1: "Foo St" } }) as FixtureRecipeImpl<any>;
        const variant2 = original.variant({ address: { line1: "Foo St 2", zip: 6000 } }) as FixtureRecipeImpl<any>;
        const variant3 = original.variant({ address: { zip: 7000 } }) as FixtureRecipeImpl<any>;

        const result = original.createFixture(ctx, { variants: [variant1, variant2, variant3] });

        expect(result).toEqual({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St 2",
            line2: "App 1",
            zip: 7000,
          },
        });
      });
    });

    describe("With variant and overrides", () => {
      it("should apply the overrides on top of the variant", () => {
        const instance = new FixtureRecipeImpl(() => ({
          id: 10,
          name: "foo",
          address: {
            line1: "Foo St",
            line2: "App 1",
            zip: "5000",
          },
        }));

        const variant = instance.variant({ address: { line1: "Bar St", line2: "App 2" } }) as FixtureRecipeImpl<any>;
        const override = {
          name: "baz",
          address: {
            line2: "App 3",
          },
        };

        const result = instance.createFixture(ctx, { variants: [variant], buildOverride: () => override });

        expect(result).toEqual({
          id: 10,
          name: "baz",
          address: {
            line1: "Bar St",
            line2: "App 3",
            zip: "5000",
          },
        });
      });
    });
  });
});
