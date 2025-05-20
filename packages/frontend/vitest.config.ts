import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [...configDefaults.exclude],
      include: ["server"],
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
