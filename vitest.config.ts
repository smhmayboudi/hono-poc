import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/*.spec.ts", ...configDefaults.exclude],
    projects: ["packages/*"],
  },
});
