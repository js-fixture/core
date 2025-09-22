import { faker } from "@faker-js/faker";
import { ContextImpl, FactoryContext } from "core/internal";
import { FixtureDraft } from "src/core/internal/fixture-draft/fixture-draft";
import { contextualValue, placeholderValue, lazyValue } from "utils/internal";

describe(FixtureDraft.name, () => {
  const factoryContext = new FactoryContext();
  let context = new ContextImpl(factoryContext, "uuid");

  describe(FixtureDraft.prototype.toFixture.name, () => {
    describe("Simple drafts", () => {
      describe("Simple draft with primitive values", () => {
        it("should return an equal object", () => {
          const draft = {
            id: 1,
            name: "value",
          };
          const isBaseDraft = faker.datatype.boolean();

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual(draft);
        });
      });

      describe("Simple draft with Date value", () => {
        it("should return an equal object", () => {
          const draft = {
            date1: new Date(2022, 3, 25),
            date2: new Date(2020, 7, 4),
          };
          const isBaseDraft = faker.datatype.boolean();

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual(draft);
        });
      });

      describe("Simple draft with an array of primitives", () => {
        it("should return an equal object", () => {
          const draft = {
            id: 1,
            values: [1, 2, 3, 4],
          };
          const isBaseDraft = faker.datatype.boolean();

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual(draft);
        });
      });

      describe("Simple draft with an array of objects", () => {
        it("should return an equal object", () => {
          const draft = {
            id: 1,
            values: [{ value: 1 }, { value: 2 }, { value: 3 }],
          };
          const isBaseDraft = faker.datatype.boolean();

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual(draft);
        });
      });

      describe("Simple draft containing nested objects", () => {
        it("should return an equal object", () => {
          const draft = {
            id: 1,
            obj: {
              value: "value",
              nestedObj: {
                something: "other_value",
              },
            },
          };
          const isBaseDraft = true;

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual(draft);
        });
      });
    });

    describe("Drafts with lazy values", () => {
      describe("Is the base draft", () => {
        it("should extract all the lazy values", () => {
          const draft = {
            id: lazyValue(() => 1),
            name: "value",
            obj: {
              objId: lazyValue(() => "abc"),
            },
          };
          const isBaseDraft = true;

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual({
            id: 1,
            name: "value",
            obj: { objId: "abc" },
          });
        });
      });

      describe("Is not the base draft", () => {
        it("should not extract any lazy value", () => {
          const draft = {
            id: lazyValue(() => 1),
            name: "value",
            obj: {
              objId: lazyValue(() => "abc"),
            },
          };
          const isBaseDraft = false;

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual(draft);
        });
      });
    });

    describe("Draft with a placeholder value", () => {
      it("should extract the placeholder value when it was built with the current context", () => {
        const draft = {
          foo: placeholderValue((ctx) => ({ prop: "placeholder_value" }), context.uuid),
          name: "value",
        };
        const isBaseDraft = faker.datatype.boolean();

        const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

        expect(result).toEqual({
          foo: { prop: "placeholder_value" },
          name: "value",
        });
      });

      it("should not extract the placeholder value when it was not built with the current context", () => {
        const draft = {
          foo: placeholderValue((ctx) => ({ prop: "placeholder_value" }), "wrong_uuid"),
          name: "value",
        };
        const isBaseDraft = faker.datatype.boolean();

        const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

        expect(result).toEqual({
          foo: draft.foo,
          name: "value",
        });
      });
    });

    describe("Drafts with contextual values", () => {
      it("should extract all the contextual values based on their original context", () => {
        const fixture1 = { id: faker.number.int() };
        const fixture2 = { id: faker.string.uuid() };
        const draft = {
          id: contextualValue((fixture) => fixture.id, { instance: fixture1 }),
          name: "value",
          obj: {
            objId: contextualValue((fixture) => fixture.id, { instance: fixture2 }),
          },
        };
        const isBaseDraft = faker.datatype.boolean();

        const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

        expect(result).toEqual({
          id: fixture1.id,
          name: "value",
          obj: { objId: fixture2.id },
        });
      });

      describe("The contextual value points to a placeholder value", () => {
        it("should extract the placeholder value when it was built with the current context", () => {
          const fixture1 = {
            foo: faker.number.int(),
            placeholder: placeholderValue((ctx) => ({ prop: "placeholder_value" }), context.uuid),
          };
          const draft = {
            foo: contextualValue((fixture) => fixture.placeholder, { instance: fixture1 }),
            name: "value",
          };
          const isBaseDraft = faker.datatype.boolean();

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual({
            foo: { prop: "placeholder_value" },
            name: "value",
          });
        });

        it("should not extract the placeholder value when it was not built with the current context", () => {
          const fixture1 = {
            foo: faker.number.int(),
            placeholder: placeholderValue((ctx) => ({ prop: "placeholder_value" }), "wrong_uuid"),
          };
          const draft = {
            foo: contextualValue((fixture) => fixture.placeholder, { instance: fixture1 }),
            name: "value",
          };
          const isBaseDraft = faker.datatype.boolean();

          const result = new FixtureDraft(draft, isBaseDraft, context).toFixture();

          expect(result).toEqual({
            foo: fixture1.placeholder,
            name: "value",
          });
        });
      });
    });
  });
});
