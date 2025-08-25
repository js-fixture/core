import { faker } from "@faker-js/faker";
import { FixtureDraft } from "src/core/internal/fixture-draft/fixture-draft";
import { contextualValue, lazyValue } from "utils/internal";

describe(FixtureDraft.name, () => {
  describe(FixtureDraft.prototype.toFixture.name, () => {
    describe("Simple drafts", () => {
      describe("Simple draft with primitive values", () => {
        it("should return an equal object", () => {
          const draft = {
            id: 1,
            name: "value",
          };
          const isBaseDraft = faker.datatype.boolean();

          const result = new FixtureDraft(draft, isBaseDraft).toFixture();

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

          const result = new FixtureDraft(draft, isBaseDraft).toFixture();

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

          const result = new FixtureDraft(draft, isBaseDraft).toFixture();

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

          const result = new FixtureDraft(draft, isBaseDraft).toFixture();

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

          const result = new FixtureDraft(draft, isBaseDraft).toFixture();

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

          const result = new FixtureDraft(draft, isBaseDraft).toFixture();

          expect(result).toEqual(draft);
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

        const result = new FixtureDraft(draft, isBaseDraft).toFixture();

        expect(result).toEqual({
          id: fixture1.id,
          name: "value",
          obj: { objId: fixture2.id },
        });
      });
    });
  });
});
