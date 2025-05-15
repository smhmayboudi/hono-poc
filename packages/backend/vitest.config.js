import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/**/application/port", ...configDefaults.exclude],
      include: ["src/**/driving", "src/**/application/use-case", "src/shared"],
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
