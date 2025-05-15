import type { RouteHandler } from "@hono/zod-openapi";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { Env } from "../../../../../env.ts";
import { tracer } from "../../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../../infrastructure/application/port/logger/logger.ts";
import { successResponse200 } from "../../../../../shared/adapter/driving/response/success.ts";
import type { PortDrivingUserPOCInformationReadID } from "../../../application/port/driving/user-poc-information-read-id.ts";
import type { UserPOCInformationReadIDRequestValidationTarget } from "./user-poc-information-read-id.request.ts";
import { userPOCInformationReadIDResponseSchema } from "./user-poc-information-read-id.response.ts";
import type { userPOCInformationReadIDRoute } from "./user-poc-information-read-id.route.ts";

export const userPOCInformationReadIDHandler =
  (
    basePath: string,
    config: PortConfig,
    domainType: string,
    logger: PortLogger,
    drivingUserPOCInformationReadID: PortDrivingUserPOCInformationReadID,
  ): RouteHandler<
    ReturnType<typeof userPOCInformationReadIDRoute>,
    Env,
    UserPOCInformationReadIDRequestValidationTarget
  > =>
  (ctx) =>
    tracer.startActiveSpan("user-poc-information-read-id.driving", async () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-read-id.driving",
        config,
      });
      logger.info({});
      const origin = new URL(ctx.req.url).origin;
      logger.debug({ origin });
      const param = ctx.req.valid("param");
      logger.debug({ param });
      const result = await drivingUserPOCInformationReadID.execute(param);
      logger.debug({ result });
      const response = {
        ...userPOCInformationReadIDResponseSchema.parse(result),
        id: result.id,
      };
      logger.debug({ response });

      return successResponse200(ctx, basePath, domainType, response);
    });
