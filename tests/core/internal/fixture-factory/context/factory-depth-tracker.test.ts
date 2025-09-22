import { FactoryDepthTracker } from "core/internal";

describe(FactoryDepthTracker, () => {
  let instance: FactoryDepthTracker;

  beforeEach(() => {
    instance = new FactoryDepthTracker();
  });

  describe(`${FactoryDepthTracker.prototype.isBaseDraft}`, () => {
    it("should return true when entering and exiting drafting mode for the first time", () => {
      instance.startDraftingMode();
      expect(instance.isBaseDraft).toBe(true);

      instance.exitDraftingMode();
      expect(instance.isBaseDraft).toBe(true);
    });

    it("should return false when entering and exiting drafting mode for the second time", () => {
      instance.startDraftingMode();

      instance.startDraftingMode();
      expect(instance.isBaseDraft).toBe(false);

      instance.exitDraftingMode();
      expect(instance.isBaseDraft).toBe(true);

      instance.exitDraftingMode();
      expect(instance.isBaseDraft).toBe(true);
    });
  });
});
