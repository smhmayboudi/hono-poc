import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCRead } from "../../../application/port/driving/user-poc-read.ts";
import { userPOCReadHandler } from "./user-poc-read.handler.ts";
import { userPOCReadRoute } from "./user-poc-read.route.ts";

export const adapterDrivingUserPOCRead = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCRead: PortDrivingUserPOCRead,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    userPOCReadRoute(),
    userPOCReadHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCRead,
    ),
  );
};
