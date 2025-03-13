import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCViewSearch } from "../../../application/port/driving/user-poc-view-search.ts";
import { userPOCViewSearchHandler } from "./user-poc-view-search.handler.ts";
import { userPOCViewSearchRoute } from "./user-poc-view-search.route.ts";

export const adapterDrivingUserPOCViewSearch = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCViewSearch: PortDrivingUserPOCViewSearch,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  app.openapi(
    userPOCViewSearchRoute(basePath, domainType),
    userPOCViewSearchHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCViewSearch,
    ),
  );
};
