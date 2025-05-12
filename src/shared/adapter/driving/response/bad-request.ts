import type { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { errorResponseSchema } from "./error.ts";

export const badRequestResponseSchema = errorResponseSchema(
  "BAD_REQUEST",
  "there was an error while processing the request",
  400,
  "Bad Request",
);

export const badRequestResponse = (ctx: Context<Env>, detail?: string) =>
  ctx.json<z.infer<ReturnType<typeof errorResponseSchema>>, 400>(
    {
      errors: [
        {
          code: "BAD_REQUEST",
          detail: detail ?? "there was an error while processing the request",
          links: {
            about: `${new URL(ctx.req.url).origin}/page/doc/error/bad-request`,
          },
          status: 400,
          title: "Bad Request",
        },
      ],
      jsonapi: { version: "1.0" },
    },
    400,
  );
