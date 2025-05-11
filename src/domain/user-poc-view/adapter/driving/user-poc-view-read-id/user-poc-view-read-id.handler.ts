import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse200 } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCViewReadID } from "../../../application/port/driving/user-poc-view-read-id.ts";
import type { UserPOCViewReadIDRequestValidationTarget } from "./user-poc-view-read-id.request.ts";
import { userPOCViewReadIDResponseSchema } from "./user-poc-view-read-id.response.ts";
import type { userPOCViewReadIDRoute } from "./user-poc-view-read-id.route.ts";

export const userPOCViewReadIDHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCViewReadID: PortDrivingUserPOCViewReadID,
  ): RouteHandler<
    ReturnType<typeof userPOCViewReadIDRoute>,
    Env,
    UserPOCViewReadIDRequestValidationTarget
  > =>
  (ctx) =>
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
        ...userPOCViewReadIDResponseSchema.parse(result),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse200(ctx, basePath, domainType, response);
    });
