import { createRoute } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "../../../../../shared/adapter/driving/response/bad-request.ts";
import { forbiddenResponseSchema } from "../../../../../shared/adapter/driving/response/forbidden.ts";
import { internalServerErrorResponseSchema } from "../../../../../shared/adapter/driving/response/internal-server-error.ts";
import { notFoundResponseSchema } from "../../../../../shared/adapter/driving/response/not-found.ts";
import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { unauthorizedResponseSchema } from "../../../../../shared/adapter/driving/response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "../../../../../shared/adapter/driving/response/unprocessable-content.ts";
import {
  userPOCUpdateJSONSchema,
  userPOCUpdateParamSchema,
} from "./user-poc-update.request.ts";
import { userPOCUpdateResponseSchema } from "./user-poc-update.response.ts";

export const userPOCUpdateRoute = () =>
  createRoute({
    description: "Update a UserPOC by id",
    method: "patch",
    path: "/api/v1/user-poc/:id",
    request: {
      body: {
        content: {
          "application/json": {
            schema: userPOCUpdateJSONSchema,
          },
        },
        description: "Data to update a UserPOC from",
        required: true,
      },
      params: userPOCUpdateParamSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: successResponseSchema(
              userPOCUpdateResponseSchema,
              "user-poc",
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
    summary: "Update a UserPOC",
    tags: ["user-poc"],
  });
