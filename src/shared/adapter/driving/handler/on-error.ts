import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import type { Env } from "../../../../env.ts";
import { ErrorAuthForbidden } from "../../../../infrastructure/adapter/middleware/auth.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { badRequestResponse } from "../response/bad-request.ts";
import { forbiddenResponse } from "../response/forbidden.ts";
import { internalServerErrorResponse } from "../response/internal-server-error.ts";

export const onErrorHandler: (
  config: PortConfig,
  logger: PortLogger,
) => ErrorHandler<Env> = (config, logger) => (error, ctx) => {
  logger.assign({
    [ATTR_CODE_FUNCTION_NAME]: "shared.driving.handler.on-error",
    config,
  });
  logger.error(error.message);
  if (error instanceof HTTPException) {
    return badRequestResponse(ctx, error.message);
  }
  if (error instanceof ErrorAuthForbidden) {
    return forbiddenResponse(ctx, error.message);
  }

  return internalServerErrorResponse(ctx, error.message);
};
