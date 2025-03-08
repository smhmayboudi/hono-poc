import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCInformationDelete } from "../../../application/port/driving/user-poc-information-delete.ts";
import { userPOCDeleteHandler } from "./user-poc-information-delete.handler.ts";
import { userPOCDeleteRoute } from "./user-poc-information-delete.route.ts";

export const adapterDrivingUserPOCInformationDelete = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCInformationDelete: PortDrivingUserPOCInformationDelete,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCDeleteRoute(basePath, domainType),
    userPOCDeleteHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationDelete,
    ),
  );
};
