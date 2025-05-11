import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCInformationUpdateJSONSchema = z
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

export const userPOCInformationUpdateParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCInformationUpdateRequestValidationTarget extends Input {
  in: {
    json: z.infer<typeof userPOCInformationUpdateJSONSchema>;
    param: z.infer<typeof userPOCInformationUpdateParamSchema>;
  };
  out: {
    json: z.infer<typeof userPOCInformationUpdateJSONSchema>;
    param: z.infer<typeof userPOCInformationUpdateParamSchema>;
  };
}
