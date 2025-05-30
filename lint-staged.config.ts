import type { Config } from "lint-staged";

export default {
  "**/*.md": ["markdownlint-cli2"],
  "**/*.ts": ["eslint --fix", "vitest related --bail 0 --run"],
  "**": ["npm audit --omit=dev", "prettier --ignore-unknown --write"],
} satisfies Config;
