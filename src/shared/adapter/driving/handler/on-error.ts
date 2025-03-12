import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import type { Env } from "../../../../env.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { internalServerErrorResponse } from "../response/internal-server-error.ts";

export const onErrorHandler: (
  config: PortConfig,
  logger: PortLogger,
) => ErrorHandler<Env> = (config, logger) => (error, ctx) => {
  logger.assign({
    [ATTR_CODE_FUNCTION_NAME]: "shared.driving.handler.on-error",
    config,
  });
  logger.error({ error });
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  return internalServerErrorResponse(ctx, error.message);
};
