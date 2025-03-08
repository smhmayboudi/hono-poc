import { z } from "@hono/zod-openapi";

export const userPOCReadIDResponseSchema = z
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
  .openapi("UserPOCReadIDResponse");
