import { z } from "@hono/zod-openapi";

import { errorLinks, jsonapi, meta, topLevelLinks } from "./json-api.ts";

export const errorResponseSchema = <
  EM extends z.ZodTypeAny,
  ES extends z.ZodTypeAny,
>(
  code: string,
  detail: string,
  status: number,
  title: string,
  errorMetaSchema?: EM,
  errorSourceSchema?: ES,
) =>
  z.object({
    errors: z.array(
      z.object({
        code: z
          .string()
          .optional()
          .openapi({ examples: [code] }),
        detail: z
          .string()
          .optional()
          .openapi({ examples: [detail] }),
        id: z
          .string()
          .optional()
          .openapi({ examples: ["id"] }),
        links: errorLinks.optional(),
        meta: errorMetaSchema ?? meta.optional(),
        source:
          errorSourceSchema ??
          z
            .object({
              pointer: z
                .string()
                .regex(/^(?:\/(?:[^~/]|~0|~1)*)*$/)
                .optional(),
              parameter: z.string().optional(),
            })
            .optional(),
        status: z.literal(status).openapi({ examples: [status] }),
        title: z
          .string()
          .optional()
          .openapi({ examples: [title] }),
      }),
    ),
    jsonapi: jsonapi.optional(),
    links: topLevelLinks.optional(),
    meta: meta.optional(),
  });
