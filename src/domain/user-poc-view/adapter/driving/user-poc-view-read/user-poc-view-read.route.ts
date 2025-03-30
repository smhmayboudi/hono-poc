import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCViewReadQuerySchema } from "./user-poc-view-read.request.ts";
import { userPOCViewReadResponseSchema } from "./user-poc-view-read.response.ts";

export const userPOCViewReadRoute = (basePath: string, domainType: string) =>
  createRoute<string, RouteConfig>({
    description: "Read UserPOCView(s)",
    method: "get",
    path: `${basePath}/${domainType}`,
    request: {
      query: userPOCViewReadQuerySchema,
    },
    responses: routeResponses(
      successArrayResponseSchema(userPOCViewReadResponseSchema, domainType),
      [200, 400, 401, 403, 404, 422, 500],
    ),
    summary: "Read UserPOCView(s)",
    tags: [domainType],
  });
