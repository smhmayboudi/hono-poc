import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCViewCreateJSONSchema = z
  .object({
    address: z.string().openapi({ examples: ["address"] }),
    age: z.number().openapi({ examples: [0] }),
    fullname: z.string().openapi({ examples: ["fullname"] }),
  })
  .strict()
  .openapi("UserPOCViewCreateRequest");

export interface UserPOCViewCreateRequestValidationTarget extends Input {
  in: {
    json: z.infer<typeof userPOCViewCreateJSONSchema>;
  };
  out: {
    json: z.infer<typeof userPOCViewCreateJSONSchema>;
  };
}
