import path from "node:path";

import esbuild from "esbuild";

const metafile = false;
const minify =
  process.env["CI"] === "true" || process.env["NODE_ENV"] === "production";
const outdir = path.join(import.meta.dirname, "../build/");
console.log(outdir);
await esbuild.build({
  bundle: true,
  entryPoints: [
    path.join(import.meta.dirname, "../src/app.deno.ts"),
    path.join(import.meta.dirname, "../src/app.node.ts"),
    path.join(import.meta.dirname, "../src/app.opentelemetry.ts"),
    path.join(import.meta.dirname, "../src/app.sentry.ts"),
    path.join(import.meta.dirname, "../src/app.ts"),
  ],
  external: ["@sentry/profiling-node", "bull"],
  format: "esm",
  metafile,
  minify,
  outdir,
  platform: "node",
  sourcemap: true,
  tsconfig: path.join(import.meta.dirname, "../tsconfig.build.json"),
});
