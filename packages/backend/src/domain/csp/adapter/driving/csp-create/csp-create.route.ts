import { createRoute } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "../../../../../shared/adapter/driving/response/bad-request.ts";
import { forbiddenResponseSchema } from "../../../../../shared/adapter/driving/response/forbidden.ts";
import { internalServerErrorResponseSchema } from "../../../../../shared/adapter/driving/response/internal-server-error.ts";
import { notFoundResponseSchema } from "../../../../../shared/adapter/driving/response/not-found.ts";
import { successResponseSchema } from "../../../../../shared/adapter/driving/response/success.ts";
import { unauthorizedResponseSchema } from "../../../../../shared/adapter/driving/response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "../../../../../shared/adapter/driving/response/unprocessable-content.ts";
import { cspCreateJSONSchema } from "./csp-create.request.ts";
import { cspCreateResponseSchema } from "./csp-create.response.ts";

export const cspCreateRoute = () =>
  createRoute({
    description: "Create a new CSP",
    method: "post",
    path: "/api/v1/csp",
    request: {
      body: {
        content: {
          "application/json": {
            schema: cspCreateJSONSchema,
          },
        },
        description: "Data to create a new CSP from",
        required: true,
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: successResponseSchema(cspCreateResponseSchema, "csp"),
          },
        },
        description: "Created",
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
    summary: "Create a new CSP",
    tags: ["csp"],
  });
