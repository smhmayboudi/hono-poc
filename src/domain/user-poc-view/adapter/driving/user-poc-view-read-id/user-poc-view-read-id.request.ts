import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCViewReadIDParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCViewReadIDRequestValidationTarget extends Input {
  in: {
    param: z.infer<typeof userPOCViewReadIDParamSchema>;
  };
  out: {
    param: z.infer<typeof userPOCViewReadIDParamSchema>;
  };
}
