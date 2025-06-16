import * as path from "node:path";

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: { "~": path.resolve(__dirname, "./app/") },
    css: true,
    coverage: {
      exclude: [...configDefaults.exclude],
      include: ["app", "server"],
      provider: "istanbul",
      reportOnFailure: true,
      reporter: ["lcov", "text-summary"],
      reportsDirectory: "coverage/",
    },
    include: ["**/*.test.ts"],
    pool: "threads",
    projects: [
      {
        extends: true,
        optimizeDeps: {
          include: [
            "hono",
            "hono/factory",
            "react/jsx-dev-runtime",
            "remix-i18next/server",
          ],
        },
        server: {
          fs: {
            strict: false,
          },
        },
        test: {
          browser: {
            enabled: true,
            instances: [{ browser: "chromium" }],
            provider: "playwright",
          },
          include: ["**/*.browser.test.{ts,tsx}"],
          includeTaskLocation: true,
          name: "browser tests",
          setupFiles: ["./tests/setup.browser.tsx"],
        },
      },
      {
        extends: true,
        test: {
          exclude: ["**/*.browser.test.{ts,tsx}"],
          include: ["**/*.server.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
          name: "server tests",
        },
      },
    ],
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
