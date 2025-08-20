import { AutoCounter } from "core/internal";

describe(AutoCounter.name, () => {
  describe(AutoCounter.prototype.getNextValue, () => {
    it("should start by 1 and keep incrementing when no key is provided", () => {
      const instance = new AutoCounter();

      expect(instance.getNextValue()).toBe(1);
      expect(instance.getNextValue()).toBe(2);
      expect(instance.getNextValue()).toBe(3);
    });

    
    it("should consider empty string and no key as the same thing", () => {
      const instance = new AutoCounter();

      expect(instance.getNextValue()).toBe(1);
      expect(instance.getNextValue("")).toBe(2);
      expect(instance.getNextValue()).toBe(3);
      expect(instance.getNextValue("")).toBe(4);
    });

    it("should start by 1 and keep incrementing the right counter when a key is provided", () => {
      const instance = new AutoCounter();

      expect(instance.getNextValue("foo")).toBe(1);
      expect(instance.getNextValue("foo")).toBe(2);
      expect(instance.getNextValue()).toBe(1);
      expect(instance.getNextValue("bar")).toBe(1);
      expect(instance.getNextValue("foo")).toBe(3);
      expect(instance.getNextValue()).toBe(2);
      expect(instance.getNextValue("bar")).toBe(2);
    });
  });
});


// test