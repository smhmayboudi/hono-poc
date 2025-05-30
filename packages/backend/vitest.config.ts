import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    css: false,
    coverage: {
      exclude: ["src/**/application/port", ...configDefaults.exclude],
      include: ["src/**/driving", "src/**/application/use-case", "src/shared"],
      provider: "istanbul",
      reportOnFailure: true,
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
