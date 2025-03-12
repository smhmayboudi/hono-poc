import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import {
  userPOCViewUpdateJSONSchema,
  userPOCViewUpdateParamSchema,
} from "./user-poc-view-update.request.ts";
import { userPOCViewUpdateResponseSchema } from "./user-poc-view-update.response.ts";

export const userPOCViewUpdateRoute = (
  basePath: string,
  domainType: string,
): RouteConfig =>
  createRoute<string, RouteConfig>({
    description: "Update a UserPOCView by id",
    method: "patch",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCViewUpdateJSONSchema,
          },
        },
        description: "Data to update a UserPOCView from",
        required: true,
      },
      params: userPOCViewUpdateParamSchema,
    },
    responses: routeResponses(
      successResponseSchema(userPOCViewUpdateResponseSchema, domainType),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "Update a UserPOCView",
    tags: [domainType],
  });
