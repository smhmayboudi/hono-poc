import { createRoute } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "../../../../../shared/adapter/driving/response/bad-request.ts";
import { forbiddenResponseSchema } from "../../../../../shared/adapter/driving/response/forbidden.ts";
import { internalServerErrorResponseSchema } from "../../../../../shared/adapter/driving/response/internal-server-error.ts";
import { notFoundResponseSchema } from "../../../../../shared/adapter/driving/response/not-found.ts";
import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { unauthorizedResponseSchema } from "../../../../../shared/adapter/driving/response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "../../../../../shared/adapter/driving/response/unprocessable-content.ts";
import { userPOCReadIDParamSchema } from "./user-poc-read-id.request.ts";
import { userPOCReadIDResponseSchema } from "./user-poc-read-id.response.ts";

export const userPOCReadIDRoute = () =>
  createRoute({
    description: "ReadID UserPOC",
    method: "get",
    path: "/api/v1/user-poc/:id",
    request: {
      params: userPOCReadIDParamSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: successResponseSchema(
              userPOCReadIDResponseSchema,
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
    summary: "ReadID UserPOC",
    tags: ["user-poc"],
  });
