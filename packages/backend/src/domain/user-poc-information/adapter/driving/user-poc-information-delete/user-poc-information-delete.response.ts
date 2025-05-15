import { z } from "@hono/zod-openapi";

export const userPOCInformationDeleteResponseSchema = z
  .object({
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCInformationDeleteResponse");
