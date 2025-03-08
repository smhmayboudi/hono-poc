import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCInformationDelete } from "../../../application/port/driving/user-poc-information-delete.ts";
import type { UserPOCInformationDeleteRequestValidationTarget } from "./user-poc-information-delete.request.ts";
import { userPOCDeleteResponseSchema } from "./user-poc-information-delete.response.ts";
import type { userPOCDeleteRoute } from "./user-poc-information-delete.route.ts";

export const userPOCDeleteHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCInformationDelete: PortDrivingUserPOCInformationDelete,
  ): RouteHandler<ReturnType<typeof userPOCDeleteRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCInformationDeleteRequestValidationTarget
    >,
  ) =>
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
      const { id } = await drivingUserPOCInformationDelete.execute(param);
      logger.debug({ id });
      const response = {
        ...userPOCDeleteResponseSchema.parse({ id }),
        id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
