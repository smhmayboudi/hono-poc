import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCCreateJSONSchema } from "./user-poc-view-create.request.ts";
import { userPOCCreateResponseSchema } from "./user-poc-view-create.response.ts";

export const userPOCCreateRoute = (
  basePath: string,
  domainType: string,
): RouteConfig =>
  createRoute<string, RouteConfig>({
    description: "Create a new UserPOCView",
    method: "post",
    path: `${basePath}/${domainType}`,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCCreateJSONSchema,
          },
        },
        description: "Data to create a new UserPOCView from",
        required: true,
      },
    },
    responses: routeResponses(
      successResponseSchema(userPOCCreateResponseSchema, domainType),
      [201, 400, 401, 404, 422, 500],
    ),
    summary: "Create a new UserPOCView",
    tags: [domainType],
  });
