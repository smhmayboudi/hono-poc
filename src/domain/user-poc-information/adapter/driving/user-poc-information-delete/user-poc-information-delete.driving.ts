import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCInformationDelete } from "../../../application/port/driving/user-poc-information-delete.ts";
import { userPOCInformationDeleteHandler } from "./user-poc-information-delete.handler.ts";
import { userPOCInformationDeleteRoute } from "./user-poc-information-delete.route.ts";

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
  return app.openapi(
    userPOCInformationDeleteRoute(),
    userPOCInformationDeleteHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationDelete,
    ),
  );
};
