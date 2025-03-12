import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCViewUpdate } from "../../../application/port/driving/user-poc-view-update.ts";
import type { UserPOCViewUpdateRequestValidationTarget } from "./user-poc-view-update.request.ts";
import { userPOCViewUpdateResponseSchema } from "./user-poc-view-update.response.ts";
import type { userPOCViewUpdateRoute } from "./user-poc-view-update.route.ts";

export const userPOCViewUpdateHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCViewUpdate: PortDrivingUserPOCViewUpdate,
  ): RouteHandler<ReturnType<typeof userPOCViewUpdateRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCViewUpdateRequestValidationTarget
    >,
  ) =>
    tracer.startActiveSpan("user-poc-view-update.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-update.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const { id } = await drivingUserPOCViewUpdate.execute({
        ...json,
        ...param,
      });
      logger.debug({ id });
      const response = {
        ...userPOCViewUpdateResponseSchema.parse({ id }),
        id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
