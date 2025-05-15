import { z } from "@hono/zod-openapi";

export const zodIsError = (value: unknown): value is z.ZodError =>
  typeof value === "object" &&
  value !== null &&
  "error" in value &&
  value.error instanceof z.ZodError;
