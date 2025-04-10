import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCViewDeleteParamSchema } from "./user-poc-view-delete.request.ts";
import { userPOCViewDeleteResponseSchema } from "./user-poc-view-delete.response.ts";

export const userPOCViewDeleteRoute = (basePath: string, domainType: string) =>
  createRoute<string, RouteConfig>({
    description: "Delete a UserPOCView by id",
    method: "delete",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      params: userPOCViewDeleteParamSchema,
    },
    responses: routeResponses(
      successResponseSchema(userPOCViewDeleteResponseSchema, domainType),
      [200, 400, 401, 403, 404, 422, 500],
    ),
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Delete a UserPOCView",
    tags: [domainType],
  });
