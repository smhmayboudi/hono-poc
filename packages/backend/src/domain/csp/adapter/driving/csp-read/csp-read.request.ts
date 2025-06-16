import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

import { requestQuerySchema } from "../../../../../shared/adapter/driving/request-query.ts";
import { cspReadResponseSchema } from "./csp-read.response.ts";

export const cspReadQuerySchema = requestQuerySchema(cspReadResponseSchema);

export interface CSPReadRequestValidationTarget extends Input {
  in: {
    query: z.infer<typeof cspReadQuerySchema>;
  };
  out: {
    query: z.infer<typeof cspReadQuerySchema>;
  };
}
