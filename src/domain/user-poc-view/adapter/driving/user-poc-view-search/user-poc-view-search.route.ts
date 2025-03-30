import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCViewSearchJSONSchema } from "./user-poc-view-search.request.ts";
import { userPOCViewSearchResponseSchema } from "./user-poc-view-search.response.ts";

export const userPOCViewSearchRoute = (basePath: string, domainType: string) =>
  createRoute<string, RouteConfig>({
    description: "Search UserPOCView(s)",
    method: "post",
    path: `${basePath}/${domainType}/search`,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCViewSearchJSONSchema,
          },
        },
        description: "Data to search a UserPOCView from",
        required: true,
      },
    },
    responses: routeResponses(
      successArrayResponseSchema(userPOCViewSearchResponseSchema, domainType),
      [200, 400, 401, 403, 404, 422, 500],
    ),
    summary: "Search UserPOCView(s)",
    tags: [domainType],
  });
