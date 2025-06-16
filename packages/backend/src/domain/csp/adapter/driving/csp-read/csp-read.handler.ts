import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successArrayResponse } from "../../../../../shared/adapter/driving/response/success-array.ts";
import type { PortDrivingCSPRead } from "../../../application/port/driving/csp-read.ts";
import type { CSPReadRequestValidationTarget } from "./csp-read.request.ts";
import { cspReadResponseSchema } from "./csp-read.response.ts";
import type { cspReadRoute } from "./csp-read.route.ts";

export const cspReadHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingCSPRead: PortDrivingCSPRead,
  ): RouteHandler<
    ReturnType<typeof cspReadRoute>,
    Env,
    CSPReadRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("csp-read.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "csp-read.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const query = ctx.req.valid("query");
      logger.debug({ query });
      const result = await drivingCSPRead.execute(query);
      logger.debug({ result });
      const response = result.data.map((value) => ({
        ...cspReadResponseSchema.parse(value),
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
