import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCInformationReadIDParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCInformationReadIDRequestValidationTarget extends Input {
  in: {
    param: z.infer<typeof userPOCInformationReadIDParamSchema>;
  };
  out: {
    param: z.infer<typeof userPOCInformationReadIDParamSchema>;
  };
}
