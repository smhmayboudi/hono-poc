import { createRoute } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "../../../../../shared/adapter/driving/response/bad-request.ts";
import { forbiddenResponseSchema } from "../../../../../shared/adapter/driving/response/forbidden.ts";
import { internalServerErrorResponseSchema } from "../../../../../shared/adapter/driving/response/internal-server-error.ts";
import { notFoundResponseSchema } from "../../../../../shared/adapter/driving/response/not-found.ts";
import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { unauthorizedResponseSchema } from "../../../../../shared/adapter/driving/response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "../../../../../shared/adapter/driving/response/unprocessable-content.ts";
import {
  userPOCInformationUpdateJSONSchema,
  userPOCInformationUpdateParamSchema,
} from "./user-poc-information-update.request.ts";
import { userPOCInformationUpdateResponseSchema } from "./user-poc-information-update.response.ts";

export const userPOCInformationUpdateRoute = () =>
  createRoute({
    description: "Update a UserPOCInformation by id",
    method: "patch",
    path: "/api/v1/user-poc-information/:id",
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
    responses: {
      200: {
        content: {
          "application/json": {
            schema: successResponseSchema(
              userPOCInformationUpdateResponseSchema,
              "user-poc-information",
            ),
          },
        },
        description: "OK",
      },
      400: {
        content: {
          "application/json": {
            schema: badRequestResponseSchema,
          },
        },
        description: "Bad Request",
      },
      401: {
        content: {
          "application/json": {
            schema: unauthorizedResponseSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: forbiddenResponseSchema,
          },
        },
        description: "Forbidden",
      },
      404: {
        content: {
          "application/json": {
            schema: notFoundResponseSchema,
          },
        },
        description: "Not Found",
      },
      422: {
        content: {
          "application/json": {
            schema: unprocessableContentResponseSchema,
          },
        },
        description: "Unprocessable Content",
      },
      500: {
        content: {
          "application/json": {
            schema: internalServerErrorResponseSchema,
          },
        },
        description: "Internal Server Error",
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Update a UserPOCInformation",
    tags: ["user-poc-information"],
  });
