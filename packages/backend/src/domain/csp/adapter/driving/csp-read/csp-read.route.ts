import { createRoute } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "../../../../../shared/adapter/driving/response/bad-request.ts";
import { forbiddenResponseSchema } from "../../../../../shared/adapter/driving/response/forbidden.ts";
import { internalServerErrorResponseSchema } from "../../../../../shared/adapter/driving/response/internal-server-error.ts";
import { notFoundResponseSchema } from "../../../../../shared/adapter/driving/response/not-found.ts";
import { successArrayResponseSchema } from "../../../../../shared/adapter/driving/response/success-array.ts";
import { unauthorizedResponseSchema } from "../../../../../shared/adapter/driving/response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "../../../../../shared/adapter/driving/response/unprocessable-content.ts";
import { cspReadQuerySchema } from "./csp-read.request.ts";
import { cspReadResponseSchema } from "./csp-read.response.ts";

export const cspReadRoute = () =>
  createRoute({
    description: "Read CSP(s)",
    method: "get",
    path: "/api/v1/csp",
    request: {
      query: cspReadQuerySchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: successArrayResponseSchema(cspReadResponseSchema, "csp"),
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
    summary: "Read CSP(s)",
    tags: ["csp"],
  });
