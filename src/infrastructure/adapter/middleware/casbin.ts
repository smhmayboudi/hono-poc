import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { MiddlewareHandler } from "hono";

import type { Env } from "../../../env.ts";
import type { PortCasbin } from "../../application/port/casbin/casbin.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";

export class ErrorCasbinEnforcer extends Error {
  constructor() {
    super("Invalid enforcer");
    this.name = "ErrorCasbinEnforcer";
  }
}

export class ErrorCasbinForbidden extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ErrorCasbinForbidden";
  }
}

export const casbinMiddleware =
  (
    casbin: PortCasbin,
    config: PortConfig,
    logger: PortLogger,
  ): MiddlewareHandler<Env, "casbin-middleware.infrastructure"> =>
  async (ctx, next) => {
    logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "casbin-middleware.infrastructure",
      config,
    });
    logger.debug({});
    const isAuthorized = await casbin.authorizer(ctx);
    logger.debug({ isAuthorized });
    if (!isAuthorized) {
      logger.debug("!isAuthorized");
      throw new ErrorCasbinForbidden();
    }
    await next();
  };
