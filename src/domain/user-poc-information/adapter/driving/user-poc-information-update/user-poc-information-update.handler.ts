import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCInformationUpdate } from "../../../application/port/driving/user-poc-information-update.ts";
import type { UserPOCInformationUpdateRequestValidationTarget } from "./user-poc-information-update.request.ts";
import { userPOCInformationUpdateResponseSchema } from "./user-poc-information-update.response.ts";
import type { userPOCInformationUpdateRoute } from "./user-poc-information-update.route.ts";

export const userPOCInformationUpdateHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCInformationUpdate: PortDrivingUserPOCInformationUpdate,
  ): RouteHandler<ReturnType<typeof userPOCInformationUpdateRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCInformationUpdateRequestValidationTarget
    >,
  ) =>
    tracer.startActiveSpan("user-poc-information-update.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-update.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const { id } = await drivingUserPOCInformationUpdate.execute({
        ...json,
        ...param,
      });
      logger.debug({ id });
      const response = {
        ...userPOCInformationUpdateResponseSchema.parse({ id }),
        id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, true);
    });
