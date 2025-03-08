/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://rollupjs.org/configuration-options
 */

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import { visualizer } from "rollup-plugin-visualizer";

const minify =
  process.env["CI"] === "true" || process.env["NODE_ENV"] === "production";

/**
 * @type {import("rollup").RollupOptions}
 */
export default {
  input: "./src/app.node.ts",
  output: {
    file: "./build/app.node.js",
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    esbuild({
      minify,
      platform: "node",
      sourceMap: true,
      tsconfig: "tsconfig.build.json",
    }),
    json(),
    nodeResolve({
      extensions: [".js", ".json", ".mjs", ".mts", ".ts"],
      preferBuiltins: true,
    }),
    ...(minify
      ? []
      : [
          visualizer({
            brotliSize: true,
            filename: "build/stats.html",
            gzipSize: true,
            sourcemap: true,
          }),
        ]),
  ],
};
