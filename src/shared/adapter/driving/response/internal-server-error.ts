import type { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { errorResponseSchema } from "./error.ts";

export const internalServerErrorResponseSchema = errorResponseSchema(
  "INTERNAL_SERVER_ERROR",
  "there was an internal server error",
  500,
  "Internal Server Error",
);

export const internalServerErrorResponse = (
  ctx: Context<Env>,
  detail?: string,
) => {
  const origin = new URL(ctx.req.url).origin;
  ctx.status(500);

  return ctx.json<z.infer<ReturnType<typeof errorResponseSchema>>, 500>({
    errors: [
      {
        code: "INTERNAL_SERVER_ERROR",
        detail: detail ?? "there was an internal server error",
        links: {
          about: `${origin}/docs/errors/INTERNAL_SERVER_ERROR`,
        },
        status: 500,
        title: "Internal Server Error",
      },
    ],
    jsonapi: { version: "1.0" },
  });
};
