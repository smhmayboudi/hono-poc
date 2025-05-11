import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse201 } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCCreate } from "../../../application/port/driving/user-poc-create.ts";
import type { UserPOCCreateRequestValidationTarget } from "./user-poc-create.request.ts";
import { userPOCCreateResponseSchema } from "./user-poc-create.response.ts";
import type { userPOCCreateRoute } from "./user-poc-create.route.ts";

export const userPOCCreateHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCCreate: PortDrivingUserPOCCreate,
  ): RouteHandler<
    ReturnType<typeof userPOCCreateRoute>,
    Env,
    UserPOCCreateRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("user-poc-create.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-create.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const result = await drivingUserPOCCreate.execute(json);
      logger.debug({ result });
      const response = {
        ...userPOCCreateResponseSchema.parse({ ...json, ...result }),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse201(ctx, basePath, domainType, response);
    });
