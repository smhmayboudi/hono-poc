import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCUpdateJSONSchema = z
  .object({
    address: z
      .string()
      .optional()
      .openapi({ examples: ["address"] }),
    age: z
      .number()
      .optional()
      .openapi({ examples: [0] }),
    userId: z
      .string()
      .optional()
      .openapi({ examples: ["userId"] }),
  })
  .strict()
  .openapi("UserPOCInformationUpdateRequest");

export const userPOCUpdateParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCInformationUpdateRequestValidationTarget extends Input {
  out: {
    json: z.infer<typeof userPOCUpdateJSONSchema>;
    param: z.infer<typeof userPOCUpdateParamSchema>;
  };
}
