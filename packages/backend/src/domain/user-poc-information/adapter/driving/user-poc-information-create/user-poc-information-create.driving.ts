import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCInformationCreate } from "../../../application/port/driving/user-poc-information-create.ts";
import { userPOCInformationCreateHandler } from "./user-poc-information-create.handler.ts";
import { userPOCInformationCreateRoute } from "./user-poc-information-create.route.ts";

export const adapterDrivingUserPOCInformationCreate = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCInformationCreate: PortDrivingUserPOCInformationCreate,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    userPOCInformationCreateRoute(),
    userPOCInformationCreateHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationCreate,
    ),
  );
};
