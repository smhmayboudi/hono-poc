import fs from "node:fs";
import path from "node:path";

import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
import esbuild from "esbuild";

const metafile = true;
const minify =
  process.env["CI"] === "true" || process.env["NODE_ENV"] === "production";
const outdir = path.join(import.meta.dirname, "../build/");
console.log(outdir);
const build = await esbuild.build({
  bundle: true,
  entryPoints: [
    path.join(import.meta.dirname, "../src/app.opentelemetry.ts"),
    path.join(import.meta.dirname, "../src/app.node.ts"),
    path.join(import.meta.dirname, "../src/app.ts"),
  ],
  external: ["@sentry/profiling-node", "bull"],
  metafile,
  minify,
  outdir,
  platform: "node",
  plugins: [
    sentryEsbuildPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    }),
  ],
  sourcemap: true,
  tsconfig: path.join(import.meta.dirname, "../tsconfig.build.json"),
});
const metafilePath = path.join(outdir, "./meta.json");
fs.writeFileSync(metafilePath, JSON.stringify(build.metafile, null, 2));
console.log(`Metafile written to ${metafilePath}`);
