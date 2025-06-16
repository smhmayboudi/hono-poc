import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingCSPCreate } from "../../../application/port/driving/csp-create.ts";
import { cspCreateHandler } from "./csp-create.handler.ts";
import { cspCreateRoute } from "./csp-create.route.ts";

export const adapterDrivingCSPCreate = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingCSPCreate: PortDrivingCSPCreate,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    cspCreateRoute(),
    cspCreateHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingCSPCreate,
    ),
  );
};
