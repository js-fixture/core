import { JsFixture } from "core";

describe("E2E - Variants", () => {
  test("Applying 'object' variants", () => {
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

  test("Applying 'contextualized' variants", () => {
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

    const canadianUserRecipe = userRecipe.variant((ctx) => ({
      address: {
        id: ctx.autoIncrement(),
        country: "Canada",
      },
    }));

    const richUserRecipe = userRecipe.variant((ctx) => ({
      salary: ctx.contextualValue((f) => 1000000),
    }));

    const userFactory1 = userRecipe.createFactory();
    expect(userFactory1.withVariants(canadianUserRecipe, richUserRecipe).create()).toEqual({
      id: 1,
      name: "foo",
      salary: 1000000,
      address: {
        id: 2,
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
        id: 2,
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
    expect(user2).toEqual({
      id: 3,
      name: "foo",
      salary: 1000000,
      address: {
        id: 4,
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
    expect(user3).toEqual({
      id: 5,
      name: "foo",
      salary: 1000000,
      address: {
        id: 6,
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
        id: 2,
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
    expect(canadianUser2).toEqual({
      id: 3,
      name: "foo",
      salary: 50000,
      address: {
        id: 4,
        line1: "100 Foo St",
        line2: "App 1",
        zipCode: 5000,
        country: "Canada",
      },
    });
  });

  test("Contextualized variant that uses a nested recipe", () => {
    const userRecipe = JsFixture.defineRecipe<any>((ctx) => ({
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
    const addressRecipe = JsFixture.defineRecipe<any>((ctx) => ({
      line1: "200 Foo St",
      line2: "App 2",
      zipCode: 6000,
      country: "US",
    }));

    const canadianUserRecipe = userRecipe.variant((ctx) => ({
      address: ctx.fromRecipe(addressRecipe).create(() => ({
        country: "CA",
        line1: ctx.contextualValue((f) => f.name),
      })),
    }));

    const user = canadianUserRecipe.createFactory().create();
    expect(user).toEqual({
      id: 1,
      name: "foo",
      salary: 50000,
      address: {
        line1: "foo",
        line2: "App 2",
        zipCode: 6000,
        country: "CA",
      },
    });
  });

  test("Contextualized variant with properties that return random values", () => {
    let i = 1;
    const getNextValue = () => {
      return `bar${i++}`;
    };

    const fooRecipe = JsFixture.defineRecipe<any>((ctx) => ({
      bar: 'bar'
    }));

    const fooVariant = fooRecipe.variant(ctx => ({
      bar: getNextValue()
    }))

    const [foo1, foo2, foo3] = fooVariant.createFactory().createMany(3);

    expect(foo1.bar).toBe("bar1");
    expect(foo2.bar).toBe("bar2");
    expect(foo3.bar).toBe("bar3");
  });
});
