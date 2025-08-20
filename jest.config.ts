import { pathsToModuleNameMapper } from "ts-jest";
const tsConfig = require('./tsconfig.test.json');

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: "<rootDir>/" }),
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
};
