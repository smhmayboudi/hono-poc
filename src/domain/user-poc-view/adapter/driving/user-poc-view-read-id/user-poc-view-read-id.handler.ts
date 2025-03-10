import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCViewReadID } from "../../../application/port/driving/user-poc-view-read-id.ts";
import type { UserPOCViewReadIDRequestValidationTarget } from "./user-poc-view-read-id.request.ts";
import { userPOCReadIDResponseSchema } from "./user-poc-view-read-id.response.ts";
import type { userPOCReadIDRoute } from "./user-poc-view-read-id.route.ts";

export const userPOCReadIDHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCViewReadID: PortDrivingUserPOCViewReadID,
  ): RouteHandler<ReturnType<typeof userPOCReadIDRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCViewReadIDRequestValidationTarget
    >,
  ) =>
    tracer.startActiveSpan("user-poc-view-read-id.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-read-id.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const result = await drivingUserPOCViewReadID.execute(param);
      logger.debug({ result });
      const response = {
        ...userPOCReadIDResponseSchema.parse(result),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
