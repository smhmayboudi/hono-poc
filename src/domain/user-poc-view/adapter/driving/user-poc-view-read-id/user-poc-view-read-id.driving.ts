import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCViewReadID } from "../../../application/port/driving/user-poc-view-read-id.ts";
import { userPOCViewReadIDHandler } from "./user-poc-view-read-id.handler.ts";
import { userPOCViewReadIDRoute } from "./user-poc-view-read-id.route.ts";

export const adapterDrivingUserPOCViewReadID = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCViewReadID: PortDrivingUserPOCViewReadID,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCViewReadIDRoute(basePath, domainType),
    userPOCViewReadIDHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewReadID,
    ),
  );
};
