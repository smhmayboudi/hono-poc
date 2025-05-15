import { z } from "@hono/zod-openapi";

export const userPOCViewUpdateResponseSchema = z
  .object({
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCViewUpdateResponse");
