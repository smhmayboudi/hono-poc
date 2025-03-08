import { serve } from "@hono/node-server";

import app from "./app.ts";

export default serve(app, (info) => {
  app.logger.info(`Listening on http://localhost:${info.port}`);
});
