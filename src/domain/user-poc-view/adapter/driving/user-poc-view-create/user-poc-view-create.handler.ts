import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCViewCreate } from "../../../application/port/driving/user-poc-view-create.ts";
import type { UserPOCViewCreateRequestValidationTarget } from "./user-poc-view-create.request.ts";
import { userPOCCreateResponseSchema } from "./user-poc-view-create.response.ts";
import type { userPOCCreateRoute } from "./user-poc-view-create.route.ts";

export const userPOCCreateHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCViewCreate: PortDrivingUserPOCViewCreate,
  ): RouteHandler<ReturnType<typeof userPOCCreateRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCViewCreateRequestValidationTarget
    >,
  ) =>
    tracer.startActiveSpan("user-poc-view-create.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-create.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const { id } = await drivingUserPOCViewCreate.execute(json);
      logger.debug({ id });
      const response = {
        ...userPOCCreateResponseSchema.parse({ ...json, id }),
        id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, false);
    });
