import pluginCSS from "@eslint/css";
import { tailwindSyntax } from "@eslint/css/syntax";
import pluginJS from "@eslint/js";
import pluginJSON from "@eslint/json";
import pluginMarkdown from "@eslint/markdown";
import pluginComment from "@eslint-community/eslint-plugin-eslint-comments";
import pluginVitest from "@vitest/eslint-plugin";
import configPrettier from "eslint-config-prettier/flat";
import pluginESX from "eslint-plugin-es-x";
import pluginJSDoc from "eslint-plugin-jsdoc";
import pluginReactJSXA11Y from "eslint-plugin-jsx-a11y";
import pluginN from "eslint-plugin-n";
import pluginPlaywright from "eslint-plugin-playwright";
import pluginPromise from "eslint-plugin-promise";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginSecurity from "eslint-plugin-security";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginSonarJS from "eslint-plugin-sonarjs";
import pluginSortClassMembers from "eslint-plugin-sort-class-members";
import pluginSortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import pluginTSDoc from "eslint-plugin-tsdoc";
import pluginTestingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "eslint/config";
import pluginTypeScriptESLint from "typescript-eslint";
import globals from "globals";

export default defineConfig([
  {
    ...pluginCSS.configs.recommended,
    files: ["packages/frontend/**/*.css"],
    language: "css/css",
    languageOptions: { customSyntax: tailwindSyntax },
    plugins: { css: pluginCSS },
  },
  {
    ...pluginJS.configs.recommended,
    files: ["**/*.js", "**/*.mjs"],
  },
  {
    ...pluginJSON.configs.recommended,
    files: ["**/*.json"],
    ignores: ["**/package-lock.json"],
    language: "json/json",
  },
  ...pluginMarkdown.configs.recommended,
  {
    ...pluginComment.configs.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "@eslint-community/eslint-comments": pluginComment },
  },
  {
    ...pluginVitest.configs.recommended,
    files: ["**/*.test.{js,ts}"],
    settings: {
      vitest: { typecheck: true },
    },
  },
  {
    ...pluginESX.configs["flat/restrict-to-es2022"],
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    ...pluginReactJSXA11Y.flatConfigs.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    ...pluginJSDoc.configs["flat/recommended-typescript-error"],
    files: ["**/*.{js,jsx}"],
    rules: {
      ...pluginJSDoc.configs["flat/recommended-typescript-error"].rules,
      "jsdoc/check-tag-names": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
  {
    ...pluginN.configs["flat/recommended-module"],
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...pluginN.configs["flat/recommended-module"].rules,
      "n/no-missing-import": "off",
    },
  },
  {
    ...pluginPlaywright.configs["flat/recommended"],
    files: ["**/*.spec.{js,ts}"],
  },
  {
    ...pluginReact.configs.flat.all,
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    ...pluginReactHooks.configs["recommended-latest"],
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    ...pluginPromise.configs["flat/recommended"],
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    ...pluginSecurity.configs.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    plugins: { "simple-import-sort": pluginSimpleImportSort },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
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
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
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
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "sort-destructure-keys": pluginSortDestructureKeys },
    rules: { "sort-destructure-keys/sort-destructure-keys": "error" },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { tsdoc: pluginTSDoc },
  },
  {
    ...pluginTestingLibrary.configs["flat/react"],
    files: ["**/*.spec.{jsx,tsx}", "**/*.test.{jsx,tsx}"],
  },
  ...pluginTypeScriptESLint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
    },
  },
  {
    ignores: [
      "**/.react-router/**",
      "**/build/**",
      "**/coverage/**",
      "**/doc/**",
      "**/drizzle/**",
      "**/node_modules/**",
      "**/plop-template/**",
      "**/script/**",
      "./*.config.js",
      "./tsconfig.base.json",
    ],
  },
  configPrettier,
]);
