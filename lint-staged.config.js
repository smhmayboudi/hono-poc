/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://github.com/lint-staged/lint-staged#configuration
 */

/**
 * @type {import("lint-staged").Config}
 */
export default {
  "**/*.md": ["markdownlint-cli2"],
  "**/*.ts": [
    "biome check --no-errors-on-unmatched --write",
    "eslint --fix",
    "oxlint",
    "vitest related --bail 0 --run",
  ],
  "**": ["prettier --ignore-unknown --write"],
};
