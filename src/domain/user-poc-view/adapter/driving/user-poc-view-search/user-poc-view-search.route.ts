import { createRoute } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "../../../../../shared/adapter/driving/response/bad-request.ts";
import { forbiddenResponseSchema } from "../../../../../shared/adapter/driving/response/forbidden.ts";
import { internalServerErrorResponseSchema } from "../../../../../shared/adapter/driving/response/internal-server-error.ts";
import { notFoundResponseSchema } from "../../../../../shared/adapter/driving/response/not-found.ts";
import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { unauthorizedResponseSchema } from "../../../../../shared/adapter/driving/response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "../../../../../shared/adapter/driving/response/unprocessable-content.ts";
import { userPOCViewSearchJSONSchema } from "./user-poc-view-search.request.ts";
import { userPOCViewSearchResponseSchema } from "./user-poc-view-search.response.ts";

export const userPOCViewSearchRoute = () =>
  createRoute({
    description: "Search UserPOCView(s)",
    method: "post",
    path: "/api/v1/user-poc-view/:id",
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
    responses: {
      200: {
        content: {
          "application/json": {
            schema: successArrayResponseSchema(
              userPOCViewSearchResponseSchema,
              "user-poc-view",
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
    summary: "Search UserPOCView(s)",
    tags: ["user-poc-view"],
  });
