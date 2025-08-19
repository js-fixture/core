import { JsFixture } from "core";
import { FixtureRecipeImpl } from "core/internal";
import { setConfig } from "utils/internal";

jest.mock("src/utils/internal/configuration");
const setConfigMock = jest.mocked(setConfig);

describe(JsFixture.name, () => {
  describe(JsFixture.defineRecipe, () => {
    it("should return a <FixtureRecipe>", () => {
      const result = JsFixture.defineRecipe(() => ({ foo: "bar" }));

      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(FixtureRecipeImpl);
    });
  });

  describe(JsFixture.configure, () => {
    it("should update the config", () => {
      const config = { array: { max: 100 } };
      JsFixture.configure(config);

      expect(setConfigMock).toHaveBeenCalledWith(config);
    });
  });
});
