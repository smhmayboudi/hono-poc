import type { z } from "@hono/zod-openapi";
import type { Input } from "hono";

import { requestQuerySchema } from "../../../../../shared/adapter/driving/request-query.ts";
import { userPOCReadResponseSchema } from "./user-poc-read.response.ts";

export const userPOCReadQuerySchema = requestQuerySchema(
  userPOCReadResponseSchema,
);

export interface UserPOCReadRequestValidationTarget extends Input {
  out: {
    query: z.infer<typeof userPOCReadQuerySchema>;
  };
}
