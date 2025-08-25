import { JsFixture } from "core";

describe("E2E - Contextual Values", () => {
  test("Contextual values from their own recipe contexts", () => {
    interface Foo {
      foo1: string;
      foo2: string;
      foo3: string;
      foo4: string;
      bar: Bar;
    }

    interface Bar {
      bar1: string;
      bar2: string;
      bar3: string;
      bar4: string;
    }

    const barRecipe = JsFixture.defineRecipe<Bar>((ctx) => ({
      bar1: "bar1",
      bar2: "bar2",
      bar3: "bar3",
      bar4: ctx.contextualValue((bar) => bar.bar3),
    }));

    const fooRecipe = JsFixture.defineRecipe((fooCtx) => ({
      foo1: "foo",
      bar: fooCtx.fromRecipe(barRecipe).create((barCtx) => ({
        bar1: "_bar1_",
        bar3: barCtx.contextualValue((fixture) => `${fixture.bar1}`),
      })),
    }));

    const result = fooRecipe.createFactory().create();

    expect(result).toEqual({
      foo1: "foo",
      bar: {
        bar1: "_bar1_",
        bar2: "bar2",
        bar3: "_bar1_",
        bar4: "_bar1_",
      },
    });
  });

  test("Contextual values from another recipe's context", () => {
    interface Foo {
      foo1: string;
      foo2: string;
      foo3: string;
      foo4: string;
      bar: Bar;
    }

    interface Bar {
      bar1: string;
      bar2: string;
      bar3: string;
      bar4: string;
      baz: Baz;
    }

    interface Baz {
      baz1: string;
    }

    const bazRecipe = JsFixture.defineRecipe<Baz>((ctx) => ({
      baz1: "baz1",
    }));

    const barRecipe = JsFixture.defineRecipe<Bar>((ctx) => ({
      bar1: "bar1",
      bar2: ctx.contextualValue(() => "bar2"),
      bar3: "bar3",
      bar4: ctx.contextualValue((bar) => bar.bar3),
      baz: ctx.fromRecipe(bazRecipe).create(),
    }));

    const fooRecipe = JsFixture.defineRecipe<Foo>((fooCtx) => ({
      foo1: "foo",
      foo2: fooCtx.contextualValue((fixture) => `${fixture.foo1}`),
      foo3: fooCtx.contextualValue((fixture) => `${fixture.foo2}-modified`),
      foo4: fooCtx.contextualValue((fixture) => fixture.bar.bar2),
      bar: fooCtx.fromRecipe(barRecipe).create((barCtx) => ({
        bar1: fooCtx.contextualValue((fixture) => fixture.foo2),
        bar2: fooCtx.contextualValue((fixture) => `${fixture.foo2}`),
        bar3: barCtx.contextualValue((fixture) => fixture.bar2),
      })),
    }));

    const result = fooRecipe.createFactory().create();

    expect(result).toEqual({
      foo1: "foo",
      foo2: "foo",
      foo3: "foo-modified",
      foo4: "foo",
      bar: {
        bar1: "foo",
        bar2: "foo",
        bar3: "foo",
        bar4: 'foo',
        baz: {
          baz1: "baz1",
        },
      },
    });
  });
});
