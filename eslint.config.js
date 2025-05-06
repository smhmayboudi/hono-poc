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
import pluginN from "eslint-plugin-n";
import pluginPromise from "eslint-plugin-promise";
import pluginSecurity from "eslint-plugin-security";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginSonarJS from "eslint-plugin-sonarjs";
import pluginSortClassMembers from "eslint-plugin-sort-class-members";
import pluginSortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import pluginTSDoc from "eslint-plugin-tsdoc";
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
  pluginN.configs["flat/recommended-module"],
  pluginPromise.configs["flat/recommended"],
  pluginSecurity.configs.recommended,
  {
    plugins: { "simple-import-sort": pluginSimpleImportSort },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
  {
    plugins: { sonarjs: pluginSonarJS },
    rules: {
      ...pluginSonarJS.configs.recommended.rules,
      "import/*": "off",
      "jsx-a11y/*": "off",
      "react-hooks/*": "off",
      "react/*": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-extra-arguments": "off",
      "sonarjs/no-nested-functions": "off",
      "sonarjs/no-redundant-jump": "off",
      "sonarjs/redundant-type-aliases": "off",
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
  ...pluginTypeScriptESLint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.es2022,
      parserOptions: { project: ["./tsconfig.eslint.json"] },
    },
  },
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "n/no-missing-import": "off",
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
