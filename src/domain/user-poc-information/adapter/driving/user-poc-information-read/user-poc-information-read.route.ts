import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCReadQuerySchema } from "./user-poc-information-read.request.ts";
import { userPOCReadResponseSchema } from "./user-poc-information-read.response.ts";

export const userPOCReadRoute = (
  basePath: string,
  domainType: string,
): RouteConfig =>
  createRoute<string, RouteConfig>({
    description: "Read UserPOCInformation(s)",
    method: "get",
    path: `${basePath}/${domainType}`,
    request: {
      query: userPOCReadQuerySchema,
    },
    responses: routeResponses(
      successArrayResponseSchema(userPOCReadResponseSchema, domainType),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "Read UserPOCInformation(s)",
    tags: [domainType],
  });
