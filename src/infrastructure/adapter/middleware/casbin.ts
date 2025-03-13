import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { Enforcer } from "casbin";
import type { MiddlewareHandler } from "hono";

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
  ): MiddlewareHandler =>
  async (ctx, next) => {
    logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "middleware.casbin",
      config,
    });
    logger.info({});
    const enforcer = await casbin.enforcer;
    if (!(enforcer instanceof Enforcer)) {
      logger.debug("!(enforcer instanceof Enforcer)");
      throw new ErrorCasbinEnforcer();
    }
    logger.debug("(enforcer instanceof Enforcer)");
    const isAllowed = await casbin.authorizer(ctx, enforcer);
    logger.debug({ isAllowed });
    if (!isAllowed) {
      logger.debug("!isAllowed");
      throw new ErrorCasbinForbidden();
    }
    logger.debug("isAllowed");
    await next();
  };
