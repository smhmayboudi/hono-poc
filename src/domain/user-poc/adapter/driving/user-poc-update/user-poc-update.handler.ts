import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCUpdate } from "../../../application/port/driving/user-poc-update.ts";
import type { UserPOCUpdateRequestValidationTarget } from "./user-poc-update.request.ts";
import { userPOCUpdateResponseSchema } from "./user-poc-update.response.ts";
import type { userPOCUpdateRoute } from "./user-poc-update.route.ts";

export const userPOCUpdateHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCUpdate: PortDrivingUserPOCUpdate,
  ): RouteHandler<
    ReturnType<typeof userPOCUpdateRoute>,
    Env,
    UserPOCUpdateRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("user-poc-update.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-update.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const { id } = await drivingUserPOCUpdate.execute({
        ...json,
        ...param,
      });
      logger.debug({ id });
      const response = {
        ...userPOCUpdateResponseSchema.parse({ id }),
        id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
