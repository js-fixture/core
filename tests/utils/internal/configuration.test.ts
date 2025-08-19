import { Config } from "types";
import { Override } from "types/internal";
import { setConfig, getConfig } from "utils/internal";

describe(setConfig.name, () => {
  it("should override the default config", () => {
    const newConfig: Override<Config> = {
      array: { max: 999 },
    };

    setConfig(newConfig);

    const actual = getConfig();
    expect(actual.array.max).toBe(999);
  });

  it("should override the previous config when called a second time", () => {
    const config1: Override<Config> = {
      array: { max: 999, min: 666 },
    };
    setConfig(config1);

    const config2: Override<Config> = {
      array: { max: 111 },
    };

    setConfig(config2);

    const actual = getConfig();
    expect(actual.array.max).toBe(111);
    expect(actual.array.min).toBe(666);
  });
});
