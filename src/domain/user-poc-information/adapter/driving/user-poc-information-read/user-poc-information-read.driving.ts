import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCInformationRead } from "../../../application/port/driving/user-poc-information-read.ts";
import { userPOCReadHandler } from "./user-poc-information-read.handler.ts";
import { userPOCReadRoute } from "./user-poc-information-read.route.ts";

export const adapterDrivingUserPOCInformationRead = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCInformationRead: PortDrivingUserPOCInformationRead,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCReadRoute(basePath, domainType),
    userPOCReadHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationRead,
    ),
  );
};
