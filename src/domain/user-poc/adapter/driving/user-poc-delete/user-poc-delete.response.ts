import { z } from "@hono/zod-openapi";

export const userPOCDeleteResponseSchema = z
  .object({
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCDeleteResponse");
