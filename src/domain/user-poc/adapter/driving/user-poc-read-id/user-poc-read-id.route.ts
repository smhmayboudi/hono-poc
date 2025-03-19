import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCReadIDParamSchema } from "./user-poc-read-id.request.ts";
import { userPOCReadIDResponseSchema } from "./user-poc-read-id.response.ts";

export const userPOCReadIDRoute = (basePath: string, domainType: string) =>
  createRoute<string, RouteConfig>({
    description: "ReadID UserPOC",
    method: "get",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      params: userPOCReadIDParamSchema,
    },
    responses: routeResponses(
      successArrayResponseSchema(userPOCReadIDResponseSchema, domainType),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "ReadID UserPOC",
    tags: [domainType],
  });
