import { FactoryDepthTracker } from "core/internal";

describe(FactoryDepthTracker, () => {
  let instance: FactoryDepthTracker;

  beforeEach(() => {
    instance = new FactoryDepthTracker();
  });

  describe(`${FactoryDepthTracker.prototype.isOutermostFactory}`, () => {
    it("should return true when entering and exiting creation mode for the first time", () => {
      instance.enterCreationMode();
      expect(instance.isOutermostFactory).toBe(true);

      instance.exitCreationMode();
      expect(instance.isOutermostFactory).toBe(true);
    });
  });

  describe(`${FactoryDepthTracker.prototype.isOutermostFactory}`, () => {
    it("should return false when entering and exiting creation mode for the second time", () => {
      instance.enterCreationMode();

      instance.enterCreationMode();
      expect(instance.isOutermostFactory).toBe(false);

      instance.exitCreationMode();
      expect(instance.isOutermostFactory).toBe(true);

      instance.exitCreationMode();
      expect(instance.isOutermostFactory).toBe(true);
    });
  });
});
