import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCReadIDParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCReadIDRequestValidationTarget extends Input {
  in: {
    param: z.infer<typeof userPOCReadIDParamSchema>;
  };
  out: {
    param: z.infer<typeof userPOCReadIDParamSchema>;
  };
}
