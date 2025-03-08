import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCDeleteParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCDeleteRequestValidationTarget extends Input {
  out: {
    param: z.infer<typeof userPOCDeleteParamSchema>;
  };
}
