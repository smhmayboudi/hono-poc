import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { NotFoundHandler } from "hono";

import type { Env } from "../../../../env.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { ErrorNotFound } from "../../../application/error/not-found.ts";
import { notFoundResponse } from "../response/not-found.ts";

export const notFoundHandler: (
  config: PortConfig,
  logger: PortLogger,
) => NotFoundHandler<Env> = (config, logger) => (ctx) => {
  const error = new ErrorNotFound();
  logger.assign({
    [ATTR_CODE_FUNCTION_NAME]: "shared.driving.handler.not-found",
    config,
  });
  logger.error(error.message);

  return notFoundResponse(ctx, error.message);
};
