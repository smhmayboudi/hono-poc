import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import {
  userPOCUpdateJSONSchema,
  userPOCUpdateParamSchema,
} from "./user-poc-information-update.request.ts";
import { userPOCUpdateResponseSchema } from "./user-poc-information-update.response.ts";

export const userPOCUpdateRoute = (
  basePath: string,
  domainType: string,
): RouteConfig =>
  createRoute<string, RouteConfig>({
    description: "Update a UserPOCInformation by id",
    method: "patch",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCUpdateJSONSchema,
          },
        },
        description: "Data to update a UserPOCInformation from",
        required: true,
      },
      params: userPOCUpdateParamSchema,
    },
    responses: routeResponses(
      successResponseSchema(userPOCUpdateResponseSchema, domainType),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "Update a UserPOCInformation",
    tags: [domainType],
  });
