import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCInformationReadQuerySchema } from "./user-poc-information-read.request.ts";
import { userPOCInformationReadResponseSchema } from "./user-poc-information-read.response.ts";

export const userPOCInformationReadRoute = (
  basePath: string,
  domainType: string,
): RouteConfig =>
  createRoute<string, RouteConfig>({
    description: "Read UserPOCInformation(s)",
    method: "get",
    path: `${basePath}/${domainType}`,
    request: {
      query: userPOCInformationReadQuerySchema,
    },
    responses: routeResponses(
      successArrayResponseSchema(
        userPOCInformationReadResponseSchema,
        domainType,
      ),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "Read UserPOCInformation(s)",
    tags: [domainType],
  });
