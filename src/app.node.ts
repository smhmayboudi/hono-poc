import { serve } from "@hono/node-server";

import app from "./app.ts";

serve(app, (info) => {
  app.logger.info(`Listening on http://127.0.0.1:${info.port}`);
});
