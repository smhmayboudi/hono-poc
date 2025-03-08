import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successArrayResponse } from "../../../../../shared/adapter/driving/response/success-array.ts";
import type { PortDrivingUserPOCRead } from "../../../application/port/driving/user-poc-read.ts";
import type { UserPOCReadRequestValidationTarget } from "./user-poc-read.request.ts";
import { userPOCReadResponseSchema } from "./user-poc-read.response.ts";
import type { userPOCReadRoute } from "./user-poc-read.route.ts";

export const userPOCReadHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCRead: PortDrivingUserPOCRead,
  ): RouteHandler<ReturnType<typeof userPOCReadRoute>, Env> =>
  (ctx: Context<Env, typeof domainType, UserPOCReadRequestValidationTarget>) =>
    tracer.startActiveSpan("user-poc-read.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-read.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const query = ctx.req.valid("query");
      logger.debug({ query });
      const list = await drivingUserPOCRead.execute(query);
      logger.debug({ list });
      const response = list.map((value) => ({
        ...userPOCReadResponseSchema.parse(value),
        id: value.id,
      }));
      logger.debug({ response });

      return successArrayResponse(ctx, basePath, domainType, response, query);
    });
