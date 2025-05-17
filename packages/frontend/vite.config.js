import build from "@hono/vite-build/node";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) =>
  mode === "client"
    ? {
        build: {
          rollupOptions: {
            input: ["./src/app.tsx", "./src/app.css"],
            output: {
              assetFileNames: "assets/[name]-[hash].[ext]",
              chunkFileNames: "assets/[name]-[hash].js",
              dir: "./build/",
              entryFileNames: "assets/[name]-[hash].js",
            },
          },
          manifest: true,
        },
        esbuild: {
          jsxImportSource: "hono/jsx/dom",
        },
      }
    : {
        plugins: [
          build({
            entry: "./src/index.tsx",
            outputDir: "./build/",
          }),
          devServer({
            entry: "./src/index.tsx",
            exclude: [/^\/assets\/.+/, ...defaultOptions.exclude],
          }),
        ],
      },
);
