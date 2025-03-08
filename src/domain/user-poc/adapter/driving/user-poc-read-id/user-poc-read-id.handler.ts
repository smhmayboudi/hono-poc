import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCReadID } from "../../../application/port/driving/user-poc-read-id.ts";
import type { UserPOCReadIDRequestValidationTarget } from "./user-poc-read-id.request.ts";
import { userPOCReadIDResponseSchema } from "./user-poc-read-id.response.ts";
import type { userPOCReadIDRoute } from "./user-poc-read-id.route.ts";

export const userPOCReadIDHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCReadID: PortDrivingUserPOCReadID,
  ): RouteHandler<ReturnType<typeof userPOCReadIDRoute>, Env> =>
  (
    ctx: Context<Env, typeof domainType, UserPOCReadIDRequestValidationTarget>,
  ) =>
    tracer.startActiveSpan("user-poc-read-id.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-read-id.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const result = await drivingUserPOCReadID.execute(param);
      logger.debug({ result });
      const response = {
        ...userPOCReadIDResponseSchema.parse(result),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
