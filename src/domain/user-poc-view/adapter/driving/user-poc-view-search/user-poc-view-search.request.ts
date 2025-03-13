import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

import { requestQuerySchema } from "../../../../../shared/adapter/driving/request-query.ts";
import { userPOCViewSearchResponseSchema } from "./user-poc-view-search.response.ts";

export const userPOCViewSearchJSONSchema = z
  .object({
    query: z.string().openapi({ examples: ["query"] }),
  })
  .strict()
  .openapi("UserPOCViewSearchRequest");

export const userPOCViewSearchQuerySchema = requestQuerySchema(
  userPOCViewSearchResponseSchema,
);

export interface UserPOCViewSearchRequestValidationTarget extends Input {
  out: {
    json: z.infer<typeof userPOCViewSearchJSONSchema>;
    query: z.infer<typeof userPOCViewSearchQuerySchema>;
  };
}
