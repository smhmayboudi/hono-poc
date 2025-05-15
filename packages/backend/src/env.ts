import type { Env as HonoEnv } from "hono";

import type { Session } from "./infrastructure/application/port/auth/auth.ts";

export interface Env extends HonoEnv {
  Bindings: Record<string, never>;
  Variables: {
    session: Session | null;
  };
}
