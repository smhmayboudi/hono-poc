import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCViewCreate } from "../../../application/port/driving/user-poc-view-create.ts";
import { userPOCViewCreateHandler } from "./user-poc-view-create.handler.ts";
import { userPOCViewCreateRoute } from "./user-poc-view-create.route.ts";

export const adapterDrivingUserPOCViewCreate = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCViewCreate: PortDrivingUserPOCViewCreate,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCViewCreateRoute(basePath, domainType),
    userPOCViewCreateHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewCreate,
    ),
  );
};
