import type { Enforcer } from "casbin";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";

export interface PortCasbin {
  authorizer: (ctx: Context<Env>, enforcer: Enforcer) => Promise<boolean>;
  enforcer: Promise<Enforcer>;
}
