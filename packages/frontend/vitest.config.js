/// <reference types="vitest" />
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://vitest.dev/config
 */

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      // exclude: ["src/**/application/port"],
      include: ["src"],
      provider: "istanbul",
      reporter: ["lcov", "text-summary"],
      reportsDirectory: "coverage/",
    },
    include: ["**/*.test.ts"],
    pool: "threads",
    reporters: [
      "default",
      [
        "junit",
        {
          includeConsoleOutput: false,
          outputFile: `${configDefaults.coverage.reportsDirectory}/junit.xml`,
        },
      ],
    ],
    watch: false,
  },
});
