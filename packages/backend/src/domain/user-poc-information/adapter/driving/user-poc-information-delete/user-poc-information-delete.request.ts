import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCInformationDeleteParamSchema = z
  .object({
    id: z.string().openapi({ examples: ["id"] }),
  })
  .strict();

export interface UserPOCInformationDeleteRequestValidationTarget extends Input {
  in: {
    param: z.infer<typeof userPOCInformationDeleteParamSchema>;
  };
  out: {
    param: z.infer<typeof userPOCInformationDeleteParamSchema>;
  };
}
