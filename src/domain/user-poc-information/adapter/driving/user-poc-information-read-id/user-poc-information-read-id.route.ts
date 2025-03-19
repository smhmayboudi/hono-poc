import { createRoute, type RouteConfig } from "@hono/zod-openapi";

import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { routeResponses } from "../../../../../shared/adapter/driving/route.ts";
import { userPOCInformationReadIDParamSchema } from "./user-poc-information-read-id.request.ts";
import { userPOCInformationReadIDResponseSchema } from "./user-poc-information-read-id.response.ts";

export const userPOCInformationReadIDRoute = (
  basePath: string,
  domainType: string,
) =>
  createRoute<string, RouteConfig>({
    description: "ReadID UserPOCInformation",
    method: "get",
    path: `${basePath}/${domainType}/{id}`,
    request: {
      params: userPOCInformationReadIDParamSchema,
    },
    responses: routeResponses(
      successArrayResponseSchema(
        userPOCInformationReadIDResponseSchema,
        domainType,
      ),
      [200, 400, 401, 404, 422, 500],
    ),
    summary: "ReadID UserPOCInformation",
    tags: [domainType],
  });
