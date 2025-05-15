import type { OpenAPIHono } from "@hono/zod-openapi";

import type { Env } from "../../../../../env.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { notFoundHandler } from "../../../../../shared/adapter/driving/handler/not-found.ts";
import { onErrorHandler } from "../../../../../shared/adapter/driving/handler/on-error.ts";
import type { PortDrivingUserPOCInformationReadID } from "../../../application/port/driving/user-poc-information-read-id.ts";
import { userPOCInformationReadIDHandler } from "./user-poc-information-read-id.handler.ts";
import { userPOCInformationReadIDRoute } from "./user-poc-information-read-id.route.ts";

export const adapterDrivingUserPOCInformationReadID = (
  app: OpenAPIHono<Env>,
  basePath: string,
  config: PortConfig,
  domainType: string,
  logger: PortLogger,
  drivingUserPOCInformationReadID: PortDrivingUserPOCInformationReadID,
) => {
  app.notFound(notFoundHandler(config, logger));
  app.onError(onErrorHandler(config, logger));
  return app.openapi(
    userPOCInformationReadIDRoute(),
    userPOCInformationReadIDHandler(
      basePath,
      config,
      domainType,
      logger,
      drivingUserPOCInformationReadID,
    ),
  );
};
