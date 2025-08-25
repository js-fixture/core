import merge from "lodash.merge";
import { produce } from "immer";
import { Config } from "types/internal";
import { Override } from "types/internal";

const DEFAULT_CONFIG = {
  array: {
    min: 2,
    max: 10,
  },
} as const satisfies Config;

let _config: Config = DEFAULT_CONFIG;

export function setConfig(config: Override<Config>): void {
  _config = produce(_config, (draft) => {
    merge(draft, config);
  });
}

export function getConfig() {
  return _config;
}
