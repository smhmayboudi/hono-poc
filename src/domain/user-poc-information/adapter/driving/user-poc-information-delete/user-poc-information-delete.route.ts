import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCDeleteParamSchema } from "./user-poc-information-delete.request.ts";
import { userPOCDeleteResponseSchema } from "./user-poc-information-delete.response.ts";

export const userPOCDeleteRoute = (
  basePath: string,
  domainType: string,
): RouteConfig =>
  createRoute<string, RouteConfig>({
    description: "Delete a UserPOCInformation by id",
    method: "delete",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      params: userPOCDeleteParamSchema,
    },
    responses: routeResponses(
      successResponseSchema(userPOCDeleteResponseSchema, domainType),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "Delete a UserPOCInformation",
    tags: [domainType],
  });
