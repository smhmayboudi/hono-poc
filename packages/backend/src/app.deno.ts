import app from "./app.ts";

// @ts-ignore
if (typeof Deno !== "undefined" && Deno.serve) {
  // @ts-ignore
  Deno.serve({ port: app.port }, app.fetch);
}
