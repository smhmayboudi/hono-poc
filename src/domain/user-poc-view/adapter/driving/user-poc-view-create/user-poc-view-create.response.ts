import { z } from "@hono/zod-openapi";

export const userPOCCreateResponseSchema = z
  .object({
    address: z
      .string()
      .optional()
      .openapi({ examples: ["address"] }),
    age: z
      .number()
      .optional()
      .openapi({ examples: [0] }),
    fullname: z
      .string()
      .optional()
      .openapi({ examples: ["fullname"] }),
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCViewCreateResponse");
