import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCInformationCreateJSONSchema } from "./user-poc-information-create.request.ts";
import { userPOCInformationCreateResponseSchema } from "./user-poc-information-create.response.ts";

export const userPOCInformationCreateRoute = (
  basePath: string,
  domainType: string,
) =>
  createRoute<string, RouteConfig>({
    description: "Create a new UserPOCInformation",
    method: "post",
    path: `${basePath}/${domainType}`,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCInformationCreateJSONSchema,
          },
        },
        description: "Data to create a new UserPOCInformation from",
        required: true,
      },
    },
    responses: routeResponses(
      successResponseSchema(userPOCInformationCreateResponseSchema, domainType),
      [201, 400, 401, 403, 404, 422, 500],
    ),
    summary: "Create a new UserPOCInformation",
    tags: [domainType],
  });
