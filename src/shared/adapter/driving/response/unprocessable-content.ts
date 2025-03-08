import { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { errorResponseSchema } from "./error.ts";

export const unprocessableContentResponseSchema = errorResponseSchema(
  "UNPROCESSABLE_CONTENT",
  "the input is invalid",
  422,
  "Unprocessable Content",
  z
    .record(z.unknown())
    .optional()
    .openapi({
      examples: [
        {
          code: "too_big",
          exact: true,
          inclusive: true,
          maximum: 2,
          message: "String must contain exactly 2 character(s)",
          path: ["country"],
          type: "string",
        },
      ],
    }),
  z.object({
    path: z.string().openapi({ examples: ["/data/attributes/country"] }),
  }),
);

export const unprocessableContentResponse = (
  ctx: Context<Env>,
  errors: z.ZodIssue[],
) => {
  const origin = new URL(ctx.req.url).origin;
  ctx.status(422);

  return ctx.json<z.infer<ReturnType<typeof errorResponseSchema>>, 422>({
    errors: errors.map((issue) => ({
      code: "UNPROCESSABLE_CONTENT",
      detail: issue.message,
      links: {
        about: `${origin}/docs/errors/UNPROCESSABLE_CONTENT`,
      },
      meta: issue,
      source: {
        pointer: `/data/attributes/${issue.path.join("/")}`,
      },
      status: 422,
      title: "Unprocessable Content",
    })),
    jsonapi: { version: "1.0" },
  });
};
