import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCViewDeleteParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCViewDeleteRequestValidationTarget extends Input {
  in: {
    param: z.infer<typeof userPOCViewDeleteParamSchema>;
  };
  out: {
    param: z.infer<typeof userPOCViewDeleteParamSchema>;
  };
}
