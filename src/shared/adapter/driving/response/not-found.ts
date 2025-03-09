import type { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { errorResponseSchema } from "./error.ts";

export const notFoundResponseSchema = errorResponseSchema(
  "NOT_FOUND",
  "there was an error while processing the request",
  404,
  "Not Found",
);

export const notFoundResponse = (ctx: Context<Env>, detail?: string) =>
  ctx.json<z.infer<ReturnType<typeof errorResponseSchema>>, 404>(
    {
      errors: [
        {
          code: "NOT_FOUND",
          detail: detail ?? "the resource does not exist",
          links: {
            about: `${new URL(ctx.req.url).origin}/docs/errors/NOT_FOUND`,
          },
          status: 404,
          title: "Not Found",
        },
      ],
      jsonapi: { version: "1.0" },
    },
    404,
  );
