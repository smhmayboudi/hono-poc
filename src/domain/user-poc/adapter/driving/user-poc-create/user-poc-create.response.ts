import { z } from "@hono/zod-openapi";

export const userPOCCreateResponseSchema = z
  .object({
    fullname: z
      .string()
      .optional()
      .openapi({ examples: ["fullname"] }),
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCCreateResponse");
