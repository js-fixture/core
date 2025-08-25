import { FixtureFactoryImpl, FixtureRecipeImpl } from "core/internal";

interface Foo {
  id: number;
  name: string;
}

describe(FixtureRecipeImpl.name, () => {
  describe(FixtureRecipeImpl.prototype.variant, () => {
    it("should return a new instance", () => {
      const instance = new FixtureRecipeImpl<Foo>(() => ({ id: 10, name: "foo" }));
      const result = instance.variant({ name: "bar" }) as FixtureRecipeImpl<Foo>;

      expect(result).toBeTruthy();
      expect(result).not.toBe(instance);
      expect(result.createDraft).toBe(instance.createDraft);
      expect(result.override).toEqual({ name: "bar" });
    });
  });

  describe(FixtureRecipeImpl.prototype.createFactory.name, () => {
    it("should create a new <FixtureFactory> from the current recipe", () => {
      const instance = new FixtureRecipeImpl(() => ({ id: 10, name: "foo" }));

      const result = instance.createFactory();

      expect(result).toBeInstanceOf(FixtureFactoryImpl);
    });
  });
});
