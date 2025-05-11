import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCViewRead } from "../../../application/port/driving/user-poc-view-read.ts";
import { userPOCViewReadHandler } from "./user-poc-view-read.handler.ts";
import { userPOCViewReadRoute } from "./user-poc-view-read.route.ts";

export const adapterDrivingUserPOCViewRead = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCViewRead: PortDrivingUserPOCViewRead,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    userPOCViewReadRoute(),
    userPOCViewReadHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewRead,
    ),
  );
};
