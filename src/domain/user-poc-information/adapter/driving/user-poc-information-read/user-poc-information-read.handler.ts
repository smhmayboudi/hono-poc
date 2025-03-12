import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successArrayResponse } from "../../../../../shared/adapter/driving/response/success-array.ts";
import type { PortDrivingUserPOCInformationRead } from "../../../application/port/driving/user-poc-information-read.ts";
import type { UserPOCInformationReadRequestValidationTarget } from "./user-poc-information-read.request.ts";
import { userPOCInformationReadResponseSchema } from "./user-poc-information-read.response.ts";
import type { userPOCInformationReadRoute } from "./user-poc-information-read.route.ts";

export const userPOCInformationReadHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCInformationRead: PortDrivingUserPOCInformationRead,
  ): RouteHandler<ReturnType<typeof userPOCInformationReadRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCInformationReadRequestValidationTarget
    >,
  ) =>
    tracer.startActiveSpan("user-poc-information-read.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-read.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const query = ctx.req.valid("query");
      logger.debug({ query });
      const list = await drivingUserPOCInformationRead.execute(query);
      logger.debug({ list });
      const response = list.map((value) => ({
        ...userPOCInformationReadResponseSchema.parse(value),
        id: value.id,
      }));
      logger.debug({ response });

      return successArrayResponse(ctx, basePath, domainType, response, query);
    });
