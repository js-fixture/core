import { pickFromArray, pickFromEnum } from "utils";
import { getNumberBetween } from "utils/internal";

jest.mock("src/utils/internal/get-number-between");

const getNumberBetweenMock = jest.mocked(getNumberBetween);

describe(pickFromArray.name, () => {
  it("should pick a random value from the list", () => {
    const values = [1, 2, 3, 4, 5];
    getNumberBetweenMock.mockReturnValue(4);
    const expected = 5; // Value at index 4

    const result = pickFromArray(values);

    expect(result).toEqual(expected);
  });
});

describe(pickFromEnum.name, () => {
  it("should pick a random value from the list", () => {
    enum MyEnum {
      foo = "foo_value", // 0
      bar = "bar_value", // 1
      baz = "baz_value", // 2
    }
    getNumberBetweenMock.mockReturnValue(2);
    const expected = "baz_value"; // Value at index 2

    const result = pickFromEnum(MyEnum);

    expect(result).toEqual(expected);
  });
});
