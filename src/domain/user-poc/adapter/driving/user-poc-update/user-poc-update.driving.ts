import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCUpdate } from "../../../application/port/driving/user-poc-update.ts";
import { userPOCUpdateHandler } from "./user-poc-update.handler.ts";
import { userPOCUpdateRoute } from "./user-poc-update.route.ts";

export const adapterDrivingUserPOCUpdate = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCUpdate: PortDrivingUserPOCUpdate,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    userPOCUpdateRoute(),
    userPOCUpdateHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCUpdate,
    ),
  );
};
