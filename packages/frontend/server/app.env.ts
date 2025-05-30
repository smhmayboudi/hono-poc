import type { Env as HonoEnv } from "hono";

import { I18N_CONTEXT, type I18nContext } from "./app.i18next";

export interface Env extends HonoEnv {
  Bindings: Record<string, never>;
  Variables: {
    [I18N_CONTEXT]?: I18nContext;
  };
}
