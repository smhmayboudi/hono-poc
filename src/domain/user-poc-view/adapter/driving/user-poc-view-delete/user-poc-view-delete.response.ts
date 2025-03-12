import { z } from "@hono/zod-openapi";

export const userPOCViewDeleteResponseSchema = z
  .object({
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCViewDeleteResponse");
