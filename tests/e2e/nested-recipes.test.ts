import { JsFixture } from "core";

describe("E2E - Nested recipes", () => {
  test("Nested recipe with autoIncrement - created from `ctx`.", () => {
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

    expect(userFactory.create()).toEqual({
      id: 1,
      name: "foo",
      address: {
        id: 1,
        line1: "133 Foo St",
      },
    });

    expect(userFactory.create()).toEqual({
      id: 2,
      name: "foo",
      address: {
        id: 2,
        line1: "133 Foo St",
      },
    });

    const [user3, user4] = userFactory.createMany(2);
    expect(user3).toEqual({
      id: 3,
      name: "foo",
      address: {
        id: 3,
        line1: "133 Foo St",
      },
    });
    expect(user4).toEqual({
      id: 4,
      name: "foo",
      address: {
        id: 4,
        line1: "133 Foo St",
      },
    });
  });

  test("Nested recipe with autoIncrement - NOT created from `ctx`.", () => {
    const addressRecipe = JsFixture.defineRecipe((ctx) => ({
      id: ctx.autoIncrement(),
      line1: "133 Foo St",
    }));

    const userRecipe = JsFixture.defineRecipe((ctx) => ({
      id: ctx.autoIncrement(),
      name: "foo",
      address: addressRecipe.createFactory().create(), // New address factory created with each user fixture
    }));

    const userFactory = userRecipe.createFactory();

    expect(addressRecipe.createFactory().create()).toEqual({
      id: 1,
      line1: "133 Foo St",
    });

    expect(userFactory.create()).toEqual({
      id: 1,
      name: "foo",
      address: {
        id: 1,
        line1: "133 Foo St",
      },
    });

    expect(userFactory.create()).toEqual({
      id: 2,
      name: "foo",
      address: {
        id: 1,
        line1: "133 Foo St",
      },
    });

    const [user3, user4] = userFactory.createMany(2);
    expect(user3).toEqual({
      id: 3,
      name: "foo",
      address: {
        id: 1,
        line1: "133 Foo St",
      },
    });
    expect(user4).toEqual({
      id: 4,
      name: "foo",
      address: {
        id: 1,
        line1: "133 Foo St",
      },
    });
  });
});
