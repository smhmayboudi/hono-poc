import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCViewCreateJSONSchema } from "./user-poc-view-create.request.ts";
import { userPOCViewCreateResponseSchema } from "./user-poc-view-create.response.ts";

export const userPOCViewCreateRoute = (basePath: string, domainType: string) =>
  createRoute<string, RouteConfig>({
    description: "Create a new UserPOCView",
    method: "post",
    path: `${basePath}/${domainType}`,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCViewCreateJSONSchema,
          },
        },
        description: "Data to create a new UserPOCView from",
        required: true,
      },
    },
    responses: routeResponses(
      successResponseSchema(userPOCViewCreateResponseSchema, domainType),
      [201, 400, 401, 403, 404, 422, 500],
    ),
    summary: "Create a new UserPOCView",
    tags: [domainType],
  });
