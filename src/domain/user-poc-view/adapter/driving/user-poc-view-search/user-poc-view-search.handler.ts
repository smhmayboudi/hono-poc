import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context } from "hono";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successArrayResponse } from "../../../../../shared/adapter/driving/response/success-array.ts";
import type { PortDrivingUserPOCViewSearch } from "../../../application/port/driving/user-poc-view-search.ts";
import type { UserPOCViewSearchRequestValidationTarget } from "./user-poc-view-search.request.ts";
import { userPOCViewSearchResponseSchema } from "./user-poc-view-search.response.ts";
import type { userPOCViewSearchRoute } from "./user-poc-view-search.route.ts";

export const userPOCViewSearchHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCViewSearch: PortDrivingUserPOCViewSearch,
  ): RouteHandler<ReturnType<typeof userPOCViewSearchRoute>, Env> =>
  (
    ctx: Context<
      Env,
      typeof domainType,
      UserPOCViewSearchRequestValidationTarget
    >,
  ) =>
    tracer.startActiveSpan("user-poc-view-search.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-search.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const query = ctx.req.valid("query");
      logger.debug({ query });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const list = await drivingUserPOCViewSearch.execute(json);
      logger.debug({ list });
      const response = list.map((value) => ({
        ...userPOCViewSearchResponseSchema.parse(value),
        id: value.id,
      }));
      logger.debug({ response });

      return successArrayResponse(ctx, basePath, domainType, response, query);
    });
