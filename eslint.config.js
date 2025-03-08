/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://eslint.org/docs/latest/use/configure/
 */

import pluginJs from "@eslint/js";
import pluginJSON from "@eslint/json";
import pluginComment from "@eslint-community/eslint-plugin-eslint-comments";
import pluginVitest from "@vitest/eslint-plugin";
import configPrettier from "eslint-config-prettier";
import pluginESX from "eslint-plugin-es-x";
import pluginJSDoc from "eslint-plugin-jsdoc";
import pluginMarkdown from "eslint-plugin-markdown";
import pluginN from "eslint-plugin-n";
import pluginPromise from "eslint-plugin-promise";
import pluginSecurity from "eslint-plugin-security";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginSonarJS from "eslint-plugin-sonarjs";
import pluginSortClassMembers from "eslint-plugin-sort-class-members";
import pluginSortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import pluginTSDoc from "eslint-plugin-tsdoc";
import pluginTypescriptSortKeys from "eslint-plugin-typescript-sort-keys";
import globals from "globals";
import pluginTypeScriptESLint from "typescript-eslint";

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  pluginJs.configs.recommended,
  pluginJSON.configs.recommended,
  {
    plugins: { "@eslint-community/eslint-comments": pluginComment },
    rules: pluginComment.configs.recommended.rules,
  },
  {
    ...pluginVitest.configs.recommended,
    files: ["**/*.test.ts"],
    settings: {
      vitest: { typecheck: true },
    },
  },
  pluginESX.configs["flat/restrict-to-es2022"],
  {
    ...pluginJSDoc.configs["flat/recommended-typescript-error"],
    rules: {
      ...pluginJSDoc.configs["flat/recommended-typescript-error"].rules,
      "jsdoc/check-tag-names": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
  ...pluginMarkdown.configs.recommended,
  pluginN.configs["flat/recommended-module"],
  pluginPromise.configs["flat/recommended"],
  pluginSecurity.configs.recommended,
  {
    plugins: { "simple-import-sort": pluginSimpleImportSort },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
      // "simple-import-sort/imports": [
      //   "error",
      //   {
      //     groups: [
      //       ["^\\u0000"],
      //       ["^node:"],
      //       ["^@?\\w"],
      //       ["^"],
      //       ["^\\."],
      //       ["^@config", "^@customer", "^@infrastructure", "^@shared"],
      //     ],
      //   },
      // ],
    },
  },
  {
    plugins: { sonarjs: pluginSonarJS },
    rules: {
      ...pluginSonarJS.configs.recommended.rules,
      "security/detect-non-literal-fs-filename": "off",
      "sonarjs/deprecation": "off",
      "sonarjs/no-commented-code": "off",
      "sonarjs/no-invalid-await": "off",
      "sonarjs/no-nested-functions": "off",
      "sonarjs/prefer-nullish-coalescing": "off",
      "sonarjs/redundant-type-aliases": "off",
      "sonarjs/sonar-max-params": "off",
      "sonarjs/sonar-prefer-optional-chain": "off",
      "sonarjs/todo-tag": "off",
      "sonarjs/no-redundant-jump": "off",
      "sonarjs/no-base-to-string": "off",
      "sonarjs/no-extra-arguments": "off",
      "sonarjs/cognitive-complexity": "off",
      "import/*": "off",
      "jsx-a11y/*": "off",
      "react-hooks/*": "off",
      "react/*": "off",
    },
    settings: { react: { version: "0" } },
  },
  {
    plugins: { "sort-class-members": pluginSortClassMembers },
    rules: {
      "sort-class-members/sort-class-members": [
        "error",
        {
          accessorPairPositioning: "getThenSet",
          order: [
            "[static-properties]",
            "[static-methods]",
            "[properties]",
            "[accessor-pairs]",
            "[getters]",
            "[setters]",
            "[conventional-private-properties]",
            "constructor",
            "[arrow-function-properties]",
            "[methods]",
            "[async-methods]",
            "[conventional-private-methods]",
            "[everything-else]",
          ],
        },
      ],
    },
  },
  {
    plugins: { "sort-destructure-keys": pluginSortDestructureKeys },
    rules: { "sort-destructure-keys/sort-destructure-keys": "error" },
  },
  { plugins: { tsdoc: pluginTSDoc } },
  {
    plugins: { "typescript-sort-keys": pluginTypescriptSortKeys },
    rules: pluginTypescriptSortKeys.configs.recommended.rules,
  },
  ...pluginTypeScriptESLint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.es2022,
      parserOptions: { project: ["./tsconfig.eslint.json"] },
    },
  },
  // Google TypeScript Recommended
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-warning-comments": "off",
      "block-scoped-var": "error",
      "eol-last": "error",
      eqeqeq: "error",
      "n/no-empty-function": "off",
      "n/no-missing-import": "off",
      "n/no-missing-require": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/shebang": "off",
      "no-dupe-class-members": "off",
      "no-restricted-properties": [
        "error",
        {
          object: "describe",
          property: "only",
        },
        {
          object: "it",
          property: "only",
        },
      ],
      "no-trailing-spaces": "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      quotes: ["warn", "single", { avoidEscape: true }],
      "require-atomic-updates": "off",
    },
  },
  // CI Time
  {
    rules: {
      "import/no-cycle": "off",
      "import/no-deprecated": "off",
      "import/no-named-as-default": "off",
      "import/no-unused-modules": "off",
    },
  },
  // NOT AT ALL
  {
    rules: {
      "import/default": "off",
      "import/extensions": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/no-named-as-default-member": "off",
      "import/no-unresolved": "off",
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
      "n/no-unsupported-features/node-builtins": "off",
    },
  },
  {
    ignores: [
      "**/build/**",
      "**/coverage/**",
      "**/doc/**",
      "**/drizzle/**",
      "**/node_modules/**",
      "**/plop-template/**",
      "./tsconfig.base.json",
    ],
  },
  configPrettier,
];
