import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCInformationDelete } from "../../../application/port/driving/user-poc-information-delete.ts";
import type { UserPOCInformationDeleteRequestValidationTarget } from "./user-poc-information-delete.request.ts";
import { userPOCInformationDeleteResponseSchema } from "./user-poc-information-delete.response.ts";
import type { userPOCInformationDeleteRoute } from "./user-poc-information-delete.route.ts";

export const userPOCInformationDeleteHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCInformationDelete: PortDrivingUserPOCInformationDelete,
  ): RouteHandler<
    ReturnType<typeof userPOCInformationDeleteRoute>,
    Env,
    UserPOCInformationDeleteRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("user-poc-information-delete.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-delete.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const result = await drivingUserPOCInformationDelete.execute(param);
      logger.debug({ result });
      const response = {
        ...userPOCInformationDeleteResponseSchema.parse(result),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
