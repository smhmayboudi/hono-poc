import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCInformationCreate } from "../../../application/port/driving/user-poc-information-create.ts";
import type { UserPOCInformationCreateRequestValidationTarget } from "./user-poc-information-create.request.ts";
import { userPOCInformationCreateResponseSchema } from "./user-poc-information-create.response.ts";
import type { userPOCInformationCreateRoute } from "./user-poc-information-create.route.ts";

export const userPOCInformationCreateHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCInformationCreate: PortDrivingUserPOCInformationCreate,
  ): RouteHandler<ReturnType<typeof userPOCInformationCreateRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCInformationCreateRequestValidationTarget
    >,
  ) =>
    tracer.startActiveSpan("user-poc-information-create.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-create.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const { id } = await drivingUserPOCInformationCreate.execute(json);
      logger.debug({ id });
      const response = {
        ...userPOCInformationCreateResponseSchema.parse({ ...json, id }),
        id,
      };
      logger.debug({ response });

      return successResponse(ctx, basePath, domainType, response, false);
    });
