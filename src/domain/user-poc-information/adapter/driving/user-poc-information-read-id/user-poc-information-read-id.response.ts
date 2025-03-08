import { z } from "@hono/zod-openapi";

export const userPOCReadIDResponseSchema = z
  .object({
    address: z
      .string()
      .optional()
      .openapi({ examples: ["address"] }),
    age: z
      .number()
      .optional()
      .openapi({ examples: [0] }),
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
    userId: z
      .string()
      .optional()
      .openapi({ examples: ["userId"] }),
  })
  .openapi("UserPOCInformationReadIDResponse");
