import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCReadID } from "../../../application/port/driving/user-poc-read-id.ts";
import { userPOCReadIDHandler } from "./user-poc-read-id.handler.ts";
import { userPOCReadIDRoute } from "./user-poc-read-id.route.ts";

export const adapterDrivingUserPOCReadID = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCReadID: PortDrivingUserPOCReadID,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    userPOCReadIDRoute(),
    userPOCReadIDHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCReadID,
    ),
  );
};
