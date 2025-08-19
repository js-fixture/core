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
});
