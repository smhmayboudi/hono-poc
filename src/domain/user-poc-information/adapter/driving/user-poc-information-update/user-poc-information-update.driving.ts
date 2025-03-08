import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCInformationUpdate } from "../../../application/port/driving/user-poc-information-update.ts";
import { userPOCUpdateHandler } from "./user-poc-information-update.handler.ts";
import { userPOCUpdateRoute } from "./user-poc-information-update.route.ts";

export const adapterDrivingUserPOCInformationUpdate = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCInformationUpdate: PortDrivingUserPOCInformationUpdate,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCUpdateRoute(basePath, domainType),
    userPOCUpdateHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationUpdate,
    ),
  );
};
