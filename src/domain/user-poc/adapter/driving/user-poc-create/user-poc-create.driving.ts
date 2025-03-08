import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCCreate } from "../../../application/port/driving/user-poc-create.ts";
import { userPOCCreateHandler } from "./user-poc-create.handler.ts";
import { userPOCCreateRoute } from "./user-poc-create.route.ts";

export const adapterDrivingUserPOCCreate = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCCreate: PortDrivingUserPOCCreate,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCCreateRoute(basePath, domainType),
    userPOCCreateHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCCreate,
    ),
  );
};
