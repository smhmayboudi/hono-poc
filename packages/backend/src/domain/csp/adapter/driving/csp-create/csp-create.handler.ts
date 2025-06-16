import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse201 } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingCSPCreate } from "../../../application/port/driving/csp-create.ts";
import type { CSPCreateRequestValidationTarget } from "./csp-create.request.ts";
import { cspCreateResponseSchema } from "./csp-create.response.ts";
import type { cspCreateRoute } from "./csp-create.route.ts";

export const cspCreateHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingCSPCreate: PortDrivingCSPCreate,
  ): RouteHandler<
    ReturnType<typeof cspCreateRoute>,
    Env,
    CSPCreateRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("csp-create.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "csp-create.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const json = ctx.req.valid("json");
      logger.debug({ json });
      const result = await drivingCSPCreate.execute(json);
      logger.debug({ result });
      const response = {
        ...cspCreateResponseSchema.parse({ ...json, ...result }),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse201(ctx, basePath, domainType, response);
    });
