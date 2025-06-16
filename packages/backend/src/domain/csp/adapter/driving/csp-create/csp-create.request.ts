import { z } from "@hono/zod-openapi";
import type { Input } from "hono";

export const cspCreateJSONSchema = z
  .object({
    "csp-report": z.object({
      "blocked-uri": z.string().openapi({ examples: ["blocked-uri"] }),
      disposition: z.string().openapi({ examples: ["disposition"] }),
      "document-uri": z.string().openapi({ examples: ["document-uri"] }),
      "effective-directive": z
        .string()
        .openapi({ examples: ["effective-directive"] }),
      "original-policy": z.string().openapi({ examples: ["original-policy"] }),
      "script-sample": z.string().openapi({ examples: ["script-sample"] }),
      referrer: z.string().openapi({ examples: ["referrer"] }),
      "status-code": z.number().openapi({ examples: [1234567890] }),
      "violated-directive": z
        .string()
        .openapi({ examples: ["violated-directive"] }),
    }),
  })
  .strict()
  .openapi("CSPCreateRequest");

export interface CSPCreateRequestValidationTarget extends Input {
  in: {
    json: z.infer<typeof cspCreateJSONSchema>;
  };
  out: {
    json: z.infer<typeof cspCreateJSONSchema>;
  };
}
