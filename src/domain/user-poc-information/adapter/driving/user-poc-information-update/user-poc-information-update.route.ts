import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import {
  userPOCInformationUpdateJSONSchema,
  userPOCInformationUpdateParamSchema,
} from "./user-poc-information-update.request.ts";
import { userPOCInformationUpdateResponseSchema } from "./user-poc-information-update.response.ts";

export const userPOCInformationUpdateRoute = (
  basePath: string,
  domainType: string,
) =>
  createRoute<string, RouteConfig>({
    description: "Update a UserPOCInformation by id",
    method: "patch",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCInformationUpdateJSONSchema,
          },
        },
        description: "Data to update a UserPOCInformation from",
        required: true,
      },
      params: userPOCInformationUpdateParamSchema,
    },
    responses: routeResponses(
      successResponseSchema(userPOCInformationUpdateResponseSchema, domainType),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "Update a UserPOCInformation",
    tags: [domainType],
  });
