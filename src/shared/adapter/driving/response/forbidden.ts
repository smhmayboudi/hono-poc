import type { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { errorResponseSchema } from "./error.ts";

export const forbiddenResponseSchema = errorResponseSchema(
  "FORBIDDEN",
  "authorization is required to access this resource",
  403,
  "Forbidden",
);

export const forbiddenResponse = (ctx: Context<Env>, detail?: string) =>
  ctx.json<z.infer<ReturnType<typeof errorResponseSchema>>, 403>(
    {
      errors: [
        {
          code: "FORBIDDEN",
          detail: detail ?? "authorization is required to access this resource",
          links: {
            about: `${new URL(ctx.req.url).origin}/docs/errors/FORBIDDEN`,
          },
          status: 403,
          title: "Forbidden",
        },
      ],
      jsonapi: { version: "1.0" },
    },
    403,
  );
