import { getNumberBetween } from "utils/internal";

describe(getNumberBetween.name, () => {
  it("should not return less than the minimum value", () => {
    Math.random = jest.fn().mockReturnValue(0);

    const result = getNumberBetween(10, 20);

    expect(result).toBe(10);
  });

  it("should not return more than the maximum value", () => {
    Math.random = jest.fn().mockReturnValue(0.9999);

    const result = getNumberBetween(10, 20);

    expect(result).toBe(20);
  });
});
