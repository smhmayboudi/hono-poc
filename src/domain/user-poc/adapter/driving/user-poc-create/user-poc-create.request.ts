import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCCreateJSONSchema = z
  .object({
    fullname: z.string().openapi({ examples: ["fullname"] }),
  })
  .strict()
  .openapi("UserPOCCreateRequest");

export interface UserPOCCreateRequestValidationTarget extends Input {
  in: {
    json: z.infer<typeof userPOCCreateJSONSchema>;
  };
  out: {
    json: z.infer<typeof userPOCCreateJSONSchema>;
  };
}
