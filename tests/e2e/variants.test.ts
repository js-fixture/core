import { JsFixture } from "core";

describe("E2E - Variants", () => {
  test("Applying variants to a factory", () => {
    const userRecipe = JsFixture.defineRecipe((ctx) => ({
      id: ctx.autoIncrement(),
      name: "foo",
      salary: 50000,
      address: {
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "US",
      },
    }));

    const canadianUserRecipe = userRecipe.variant({
      address: {
        country: "Canada",
      },
    });

    const richUserRecipe = userRecipe.variant({
      salary: 1000000,
    });

    const userFactory1 = userRecipe.createFactory();
    expect(userFactory1.withVariants(canadianUserRecipe, richUserRecipe).create()).toEqual({
      id: 1,
      name: "foo",
      salary: 1000000,
      address: {
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });

    const userFactory2 = userRecipe.createFactory();

    const [user1, user2, user3] = userFactory2.withVariants(canadianUserRecipe, richUserRecipe).createMany(3);

    expect(user1).toEqual({
      id: 1,
      name: "foo",
      salary: 1000000,
      address: {
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
    expect(user2).toEqual({
      id: 2,
      name: "foo",
      salary: 1000000,
      address: {
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
    expect(user3).toEqual({
      id: 3,
      name: "foo",
      salary: 1000000,
      address: {
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });

    // New factory: We expect IDs to start from 1 again
    const [canadianUser1, canadianUser2] = canadianUserRecipe.createFactory().createMany(2);

    expect(canadianUser1).toEqual({
      id: 1,
      name: "foo",
      salary: 50000,
      address: {
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
    expect(canadianUser2).toEqual({
      id: 2,
      name: "foo",
      salary: 50000,
      address: {
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
  });
});
