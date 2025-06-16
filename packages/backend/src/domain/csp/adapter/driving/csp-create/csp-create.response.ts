import { z } from "@hono/zod-openapi";

export const cspCreateResponseSchema = z
  .object({
    timestamp: z
      .date()
      .optional()
      .openapi({ examples: ["timestamp"] }),
    "csp-report": z
      .object({
        "blocked-uri": z
          .string()
          .optional()
          .openapi({ examples: ["blocked-uri"] }),
        disposition: z
          .string()
          .optional()
          .openapi({ examples: ["disposition"] }),
        "document-uri": z
          .string()
          .optional()
          .openapi({ examples: ["document-uri"] }),
        "effective-directive": z
          .string()
          .optional()
          .openapi({ examples: ["effective-directive"] }),
        "original-policy": z
          .string()
          .optional()
          .openapi({ examples: ["original-policy"] }),
        "script-sample": z
          .string()
          .optional()
          .openapi({ examples: ["script-sample"] }),
        referrer: z
          .string()
          .optional()
          .openapi({ examples: ["referrer"] }),
        "status-code": z
          .number()
          .optional()
          .openapi({ examples: [1234567890] }),
        "violated-directive": z
          .string()
          .optional()
          .openapi({ examples: ["violated-directive"] }),
      })
      .optional(),
    id: z
      .string()
      .optional()
      .openapi({ examples: ["id"] }),
  })
  .openapi("CSPCreateResponse");
