import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import type { Manifest } from "vite";

import manifest from "../build/.vite/manifest.json" assert { type: "json" };

const app = new Hono();

app.use("/assets/*", serveStatic({ root: "./build/" }));

export const routes = app.get("/api/clock", (c) => {
  return c.json({
    time: new Date().toLocaleTimeString(),
  });
});

export type AppType = typeof routes;

app.get("/", (c) => {
  const getCssFiles = (entry: string) => {
    const manifestChunk = (manifest as Manifest)[entry];
    if (!manifestChunk) {
      return [];
    }

    const cssFiles = manifestChunk.css || [];
    if (manifestChunk.file.endsWith(".css")) {
      return [`/${manifestChunk.file}`, ...cssFiles.map((file) => `/${file}`)];
    }
    return cssFiles.map((file) => `/${file}`);
  };

  const cssFiles = import.meta.env.PROD
    ? [...getCssFiles("src/app.css"), ...getCssFiles("src/app.tsx")]
    : ["/src/app.css"];

  return c.html(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link href="/hono.svg" rel="icon" type="image/svg+xml" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link
          href="https://cdn.simplecss.org/simple.min.css"
          rel="stylesheet"
        />
        {cssFiles.map((href) => (
          <link href={href} key={href} rel="stylesheet" />
        ))}
      </head>
      <body>
        <div id="root" />
      </body>
      <script
        src={
          import.meta.env.PROD
            ? `/${manifest["src/app.tsx"].file}`
            : "/src/app.tsx"
        }
        type="module"
      />
    </html>,
  );
});

export default app;
