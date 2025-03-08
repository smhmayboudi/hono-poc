/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://commitlint.js.org/reference/configuration.html
 */

/**
 * @type {import("@commitlint/types").UserConfig}
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["build", "ci", "docs", "feat", "fix", "perf", "refactor", "test"],
    ],
  },
};
