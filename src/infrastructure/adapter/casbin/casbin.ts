import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { type Enforcer, newEnforcer } from "casbin";
import type { Context } from "hono";

import type { Env } from "../../../env.ts";
import type { PortAuth } from "../../application/port/auth/auth.ts";
import type { PortCasbin } from "../../application/port/casbin/casbin.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Casbin implements PortCasbin {
  enforcer = newEnforcer(
    "./.docker/app/model.conf",
    "./.docker/app/policy.csv",
  );

  constructor(
    private readonly auth: PortAuth,
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {}

  async authorizer(ctx: Context<Env>, enforcer: Enforcer): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "casbin.authorizer",
      config: this.config,
    });
    this.logger.info({});
    const session = await this.auth.session(ctx);
    this.logger.debug({ session });
    ctx.set("session", session);
    const { method, path } = ctx.req;
    const user = session?.user.id ?? "anonymous";
    this.logger.debug({ method, path, user });

    return await enforcer.enforce(user, path, method);
  }
}

export const casbin = (
  auth: PortAuth,
  config: PortConfig,
  logger: PortLogger,
) =>
  tracer.startActiveSpan(
    "casbin.infrastructure",
    () => new Casbin(auth, config, logger),
  );
