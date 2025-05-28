import type { Env as HonoEnv } from "hono";

export interface Env extends HonoEnv {
  Bindings: Record<string, never>;
  Variables: Record<string, never>;
}
