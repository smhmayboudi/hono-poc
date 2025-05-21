import type { UserConfig } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["build", "ci", "docs", "feat", "fix", "perf", "refactor", "test"],
    ],
  },
} satisfies UserConfig;
