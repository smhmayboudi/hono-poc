import { z } from "@hono/zod-openapi";

export const userPOCReadResponseSchema = z
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
  .openapi("UserPOCReadResponse");
