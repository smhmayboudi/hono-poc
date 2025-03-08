import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCUpdateJSONSchema = z
  .object({
    fullname: z
      .string()
      .optional()
      .openapi({ examples: ["fullname"] }),
  })
  .strict()
  .openapi("UserPOCUpdateRequest");

export const userPOCUpdateParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCUpdateRequestValidationTarget extends Input {
  out: {
    json: z.infer<typeof userPOCUpdateJSONSchema>;
    param: z.infer<typeof userPOCUpdateParamSchema>;
  };
}
