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
    fullname: z
      .string()
      .optional()
      .openapi({ examples: ["fullname"] }),
  })
  .strict()
  .openapi("UserPOCViewUpdateRequest");

export const userPOCUpdateParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCViewUpdateRequestValidationTarget extends Input {
  out: {
    json: z.infer<typeof userPOCUpdateJSONSchema>;
    param: z.infer<typeof userPOCUpdateParamSchema>;
  };
}
