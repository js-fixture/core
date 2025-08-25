import { JsFixture } from "core";

describe("E2E - Lazy Values", () => {
  test("`ctx.autoIncrement()` overriden by static values", () => {
    const addressRecipe = JsFixture.defineRecipe((ctx) => ({
      id: ctx.autoIncrement(),
      line1: "133 Foo St",
    }));

    const userRecipe = JsFixture.defineRecipe((ctx) => ({
      id: ctx.autoIncrement(),
      name: "foo",
      address: ctx.fromRecipe(addressRecipe).create(),
    }));

    const userFactory = userRecipe.createFactory();

    const user1 = userFactory.create(() => ({
      id: 100,
    }));
    expect(user1).toEqual({
      id: 100,
      name: "foo",
      address: {
        id: 1,
        line1: "133 Foo St",
      },
    });

    const user2 = userFactory.create(() => ({ address: { id: 200 } }));
    expect(user2).toEqual({
      id: 1, // id is 1, since user1's id was overriden by a static value
      name: "foo",
      address: {
        id: 200,
        line1: "133 Foo St",
      },
    });

    const user3 = userFactory.create();
    expect(user3).toEqual({
      id: 2,
      name: "foo",
      address: {
        id: 2,
        line1: "133 Foo St",
      },
    });
  });

  test("test", () => {
    interface Foo {
      name: string;
      other: string;
      other2: string;
      other3: string;
      address: Address;
    }

    interface Address {
      name: string;
      line1:string;
    }

    const addressRecipe=JsFixture.defineRecipe<Address>(ctx =>({
      name: "100",
      line1:ctx.contextualValue(() => 'line1')
    }))

    const fooRecipe = JsFixture.defineRecipe<Foo>((ctx) => ({
      name: "foo",
      other3: ctx.contextualValue((fixture) => fixture.address.line1),
      other2: ctx.contextualValue((fixture) => `${fixture.other}`),
      other: ctx.contextualValue((fixture) => `${fixture.name}`),
      address: ctx.fromRecipe(addressRecipe).create(() => ({
        name: ctx.contextualValue(fixture => fixture.other)
      }))
    }));

    const test = fooRecipe.createFactory().create();
    debugger;
  });
});
