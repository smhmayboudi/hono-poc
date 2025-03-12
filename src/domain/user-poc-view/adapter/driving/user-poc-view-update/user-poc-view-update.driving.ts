import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCViewUpdate } from "../../../application/port/driving/user-poc-view-update.ts";
import { userPOCViewUpdateHandler } from "./user-poc-view-update.handler.ts";
import { userPOCViewUpdateRoute } from "./user-poc-view-update.route.ts";

export const adapterDrivingUserPOCViewUpdate = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCViewUpdate: PortDrivingUserPOCViewUpdate,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCViewUpdateRoute(basePath, domainType),
    userPOCViewUpdateHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewUpdate,
    ),
  );
};
