import type { Context } from "hono";

import type { Env } from "../../../../env.ts";

export interface PortCasbin {
  authorizer: (ctx: Context<Env>) => Promise<boolean>;
}
