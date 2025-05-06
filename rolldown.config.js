/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://rollupjs.org/configuration-options
 */

import esbuild from "rollup-plugin-esbuild";

const minify =
  process.env["CI"] === "true" || process.env["NODE_ENV"] === "production";

/**
 * @type {import("rolldown").RolldownOptions}
 */
export default {
  input: "./src/app.node.ts",
  output: {
    file: "./build/app.node.js",
    sourcemap: true,
  },
  plugins: [
    esbuild({
      minify,
      platform: "node",
      sourceMap: true,
      tsconfig: "tsconfig.build.json",
    }),
  ],
};
