import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { APIError } from "better-call";
import type { MiddlewareHandler } from "hono";

import type { Env } from "../../../env.ts";
import type { PortAuth } from "../../application/port/auth/auth.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { authPermission } from "./auth-permission.ts";

export class ErrorAuthForbidden extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ErrorAuthForbidden";
  }
}

export const authMiddleware =
  (
    auth: PortAuth,
    basePath: string,
    config: PortConfig,
    disabledPaths: string[],
    logger: PortLogger,
  ): MiddlewareHandler<Env, "auth-middleware.infrastructure"> =>
  async (ctx, next) => {
    logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "auth-middleware.infrastructure",
      config,
    });
    logger.debug({});
    const session = await auth.session(ctx);
    logger.debug({ ctx, session });
    ctx.set("session", session);
    const { method, path } = ctx.req;
    const userId = session?.user.id ?? "anonymous";
    logger.debug({ method, path, userId });
    if (disabledPaths.every((value) => !path.includes(value))) {
      try {
        const userHasPermission = await auth.userHasPermission(
          authPermission(basePath, method, path) ?? {},
          userId,
        );
        if (!userHasPermission) {
          logger.debug("!userHasPermission");
          throw new ErrorAuthForbidden();
        }
      } catch (error) {
        if (
          error instanceof APIError &&
          error.body?.code === "USER_NOT_FOUND"
        ) {
          logger.debug(
            `error instanceof APIError && error.body?.code === "USER_NOT_FOUND"`,
          );
          throw new ErrorAuthForbidden();
        }
        throw error;
      }
    }
    await next();
  };
