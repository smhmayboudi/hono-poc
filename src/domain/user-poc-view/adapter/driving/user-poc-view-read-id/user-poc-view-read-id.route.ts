import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCViewReadIDParamSchema } from "./user-poc-view-read-id.request.ts";
import { userPOCViewReadIDResponseSchema } from "./user-poc-view-read-id.response.ts";

export const userPOCViewReadIDRoute = (basePath: string, domainType: string) =>
  createRoute<string, RouteConfig>({
    description: "ReadID UserPOCView",
    method: "get",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      params: userPOCViewReadIDParamSchema,
    },
    responses: routeResponses(
      successArrayResponseSchema(userPOCViewReadIDResponseSchema, domainType),
      [200, 400, 401, 403, 404, 422, 500],
    ),
    summary: "ReadID UserPOCView",
    tags: [domainType],
  });
