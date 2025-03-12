import type { z } from "@hono/zod-openapi";
import type { Input } from "hono";

import { requestQuerySchema } from "../../../../../shared/adapter/driving/request-query.ts";
import { userPOCViewReadResponseSchema } from "./user-poc-view-read.response.ts";

export const userPOCViewReadQuerySchema = requestQuerySchema(
  userPOCViewReadResponseSchema,
);

export interface UserPOCViewReadRequestValidationTarget extends Input {
  out: {
    query: z.infer<typeof userPOCViewReadQuerySchema>;
  };
}
