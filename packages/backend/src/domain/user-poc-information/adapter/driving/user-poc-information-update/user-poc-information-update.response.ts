import { z } from "@hono/zod-openapi";

export const userPOCInformationUpdateResponseSchema = z
  .object({
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("UserPOCInformationUpdateResponse");
