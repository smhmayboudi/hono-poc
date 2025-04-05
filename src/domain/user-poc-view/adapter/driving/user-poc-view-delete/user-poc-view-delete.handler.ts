import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCViewDelete } from "../../../application/port/driving/user-poc-view-delete.ts";
import type { UserPOCViewDeleteRequestValidationTarget } from "./user-poc-view-delete.request.ts";
import { userPOCViewDeleteResponseSchema } from "./user-poc-view-delete.response.ts";
import type { userPOCViewDeleteRoute } from "./user-poc-view-delete.route.ts";

export const userPOCViewDeleteHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCViewDelete: PortDrivingUserPOCViewDelete,
  ): RouteHandler<
    ReturnType<typeof userPOCViewDeleteRoute>,
    Env,
    UserPOCViewDeleteRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("user-poc-view-delete.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-delete.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const result = await drivingUserPOCViewDelete.execute(param);
      logger.debug({ result });
      const response = {
        ...userPOCViewDeleteResponseSchema.parse(result),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
