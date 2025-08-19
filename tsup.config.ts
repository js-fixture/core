import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/utils/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: true,
  tsconfig: "tsconfig.build.json",
  splitting: false,
});
