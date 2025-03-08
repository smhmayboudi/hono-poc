import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCDelete } from "../../../application/port/driving/user-poc-delete.ts";
import type { UserPOCDeleteRequestValidationTarget } from "./user-poc-delete.request.ts";
import { userPOCDeleteResponseSchema } from "./user-poc-delete.response.ts";
import type { userPOCDeleteRoute } from "./user-poc-delete.route.ts";

export const userPOCDeleteHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCDelete: PortDrivingUserPOCDelete,
  ): RouteHandler<ReturnType<typeof userPOCDeleteRoute>, Env> =>
  (
    ctx: Context<Env, typeof domainType, UserPOCDeleteRequestValidationTarget>,
  ) =>
    tracer.startActiveSpan("user-poc-delete.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-delete.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const { id } = await drivingUserPOCDelete.execute(param);
      logger.debug({ id });
      const response = {
        ...userPOCDeleteResponseSchema.parse({ id }),
        id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
