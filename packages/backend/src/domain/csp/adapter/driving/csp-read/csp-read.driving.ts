import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingCSPRead } from "../../../application/port/driving/csp-read.ts";
import { cspReadHandler } from "./csp-read.handler.ts";
import { cspReadRoute } from "./csp-read.route.ts";

export const adapterDrivingCSPRead = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingCSPRead: PortDrivingCSPRead,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    cspReadRoute(),
    cspReadHandler(basePath, config, domainType, logger, drivingCSPRead),
  );
};
