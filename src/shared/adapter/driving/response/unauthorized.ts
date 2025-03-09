import type { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { errorResponseSchema } from "./error.ts";

export const unauthorizedResponseSchema = errorResponseSchema(
  "UNAUTHORIZED",
  "authentication is required to access this resource",
  401,
  "Unauthorized",
);

export const unauthorizedResponse = (ctx: Context<Env>, detail?: string) =>
  ctx.json<z.infer<ReturnType<typeof errorResponseSchema>>, 401>(
    {
      errors: [
        {
          code: "UNAUTHORIZED",
          detail:
            detail ?? "authentication is required to access this resource",
          links: {
            about: `${new URL(ctx.req.url).origin}/docs/errors/UNAUTHORIZED`,
          },
          status: 401,
          title: "Unauthorized",
        },
      ],
      jsonapi: { version: "1.0" },
    },
    401,
  );
