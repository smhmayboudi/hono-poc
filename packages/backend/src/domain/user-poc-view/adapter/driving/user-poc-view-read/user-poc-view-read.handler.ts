import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successArrayResponse } from "../../../../../shared/adapter/driving/response/success-array.ts";
import type { PortDrivingUserPOCViewRead } from "../../../application/port/driving/user-poc-view-read.ts";
import type { UserPOCViewReadRequestValidationTarget } from "./user-poc-view-read.request.ts";
import { userPOCViewReadResponseSchema } from "./user-poc-view-read.response.ts";
import type { userPOCViewReadRoute } from "./user-poc-view-read.route.ts";

export const userPOCViewReadHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCViewRead: PortDrivingUserPOCViewRead,
  ): RouteHandler<
    ReturnType<typeof userPOCViewReadRoute>,
    Env,
    UserPOCViewReadRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("user-poc-view-read.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-read.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const query = ctx.req.valid("query");
      logger.debug({ query });
      const result = await drivingUserPOCViewRead.execute(query);
      logger.debug({ result });
      const response = result.data.map((value) => ({
        ...userPOCViewReadResponseSchema.parse(value),
        id: value.id,
      }));
      logger.debug({ response });

      return successArrayResponse(
        ctx,
        basePath,
        domainType,
        query,
        response,
        result.pagination,
      );
    });
