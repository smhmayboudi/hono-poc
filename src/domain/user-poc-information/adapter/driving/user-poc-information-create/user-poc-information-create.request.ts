import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const userPOCInformationCreateJSONSchema = z
  .object({
    address: z.string().openapi({ examples: ["address"] }),
    age: z.number().openapi({ examples: [0] }),
    userId: z.string().openapi({ examples: ["userId"] }),
  })
  .strict()
  .openapi("UserPOCInformationCreateRequest");

export interface UserPOCInformationCreateRequestValidationTarget extends Input {
  out: {
    json: z.infer<typeof userPOCInformationCreateJSONSchema>;
  };
}
