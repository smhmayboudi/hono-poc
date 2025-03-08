import { z } from "@hono/zod-openapi";

export const userPOCUpdateResponseSchema = z
  .object({
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCUpdateResponse");
