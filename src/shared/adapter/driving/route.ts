import type { RouteConfig, z } from "@hono/zod-openapi";

import { badRequestResponseSchema } from "./response/bad-request.ts";
import { internalServerErrorResponseSchema } from "./response/internal-server-error.ts";
import { notFoundResponseSchema } from "./response/not-found.ts";
import { unauthorizedResponseSchema } from "./response/unauthorized.ts";
import { unprocessableContentResponseSchema } from "./response/unprocessable-content.ts";

export const routeResponses = <S extends z.ZodTypeAny>(
  schema: S,
  statusCode: (200 | 201 | 400 | 401 | 404 | 422 | 500)[],
): RouteConfig["responses"] => {
  const responses: RouteConfig["responses"] = {};
  if (statusCode.includes(200)) {
    responses[200] = {
      content: {
        "application/vnd.api+json": {
          schema,
        },
      },
      description: "OK",
    };
  } else if (statusCode.includes(201)) {
    responses[201] = {
      content: {
        "application/vnd.api+json": {
          schema,
        },
      },
      description: "Created",
    };
  }
  if (statusCode.includes(400)) {
    responses[400] = {
      content: {
        "application/vnd.api+json": {
          schema: badRequestResponseSchema,
        },
      },
      description: "Bad Request",
    };
  }
  if (statusCode.includes(401)) {
    responses[401] = {
      content: {
        "application/vnd.api+json": {
          schema: unauthorizedResponseSchema,
        },
      },
      description: "Unauthorized",
    };
  }
  if (statusCode.includes(404)) {
    responses[404] = {
      content: {
        "application/vnd.api+json": {
          schema: notFoundResponseSchema,
        },
      },
      description: "Not Found",
    };
  }
  if (statusCode.includes(422)) {
    responses[422] = {
      content: {
        "application/vnd.api+json": {
          schema: unprocessableContentResponseSchema,
        },
      },
      description: "Unprocessable Content",
    };
  }
  if (statusCode.includes(500)) {
    responses[500] = {
      content: {
        "application/vnd.api+json": {
          schema: internalServerErrorResponseSchema,
        },
      },
      description: "Internal Server Error",
    };
  }

  return responses;
};
