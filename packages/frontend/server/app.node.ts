import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { handler } from "hono-react-router-adapter/node";

import * as build from "../build/server";
import app from "./app";
import { getLoadContext } from "./app.node.load-context";

app.use(serveStatic({ root: "./build/client" }));

serve(
  { fetch: handler(build, app, { getLoadContext }).fetch, port: 3010 },
  (info) => {
    console.info(`Listening on http://127.0.0.1:${info.port}`);
  },
);
