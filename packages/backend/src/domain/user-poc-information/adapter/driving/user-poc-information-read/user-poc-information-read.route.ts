import { createRoute } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "../../../../../shared/adapter/driving/response/bad-request.ts";
import { forbiddenResponseSchema } from "../../../../../shared/adapter/driving/response/forbidden.ts";
import { internalServerErrorResponseSchema } from "../../../../../shared/adapter/driving/response/internal-server-error.ts";
import { notFoundResponseSchema } from "../../../../../shared/adapter/driving/response/not-found.ts";
import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { unauthorizedResponseSchema } from "../../../../../shared/adapter/driving/response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "../../../../../shared/adapter/driving/response/unprocessable-content.ts";
import { userPOCInformationReadQuerySchema } from "./user-poc-information-read.request.ts";
import { userPOCInformationReadResponseSchema } from "./user-poc-information-read.response.ts";

export const userPOCInformationReadRoute = () =>
  createRoute({
    description: "Read UserPOCInformation(s)",
    method: "get",
    path: "/api/v1/user-poc-information",
    request: {
      query: userPOCInformationReadQuerySchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: successArrayResponseSchema(
              userPOCInformationReadResponseSchema,
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
    summary: "Read UserPOCInformation(s)",
    tags: ["user-poc-information"],
  });
