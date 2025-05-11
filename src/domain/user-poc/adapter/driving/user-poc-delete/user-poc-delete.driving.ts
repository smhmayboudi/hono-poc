import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCDelete } from "../../../application/port/driving/user-poc-delete.ts";
import { userPOCDeleteHandler } from "./user-poc-delete.handler.ts";
import { userPOCDeleteRoute } from "./user-poc-delete.route.ts";

export const adapterDrivingUserPOCDelete = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCDelete: PortDrivingUserPOCDelete,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    userPOCDeleteRoute(),
    userPOCDeleteHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCDelete,
    ),
  );
};
