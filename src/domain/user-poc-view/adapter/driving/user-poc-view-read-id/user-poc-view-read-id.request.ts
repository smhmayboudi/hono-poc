import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCReadIDParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCViewReadIDRequestValidationTarget extends Input {
  out: {
    param: z.infer<typeof userPOCReadIDParamSchema>;
  };
}
