import { createId } from "@paralleldrive/cuid2";

import type { PortGenerate } from "../../application/port/generate/generate.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Generate implements PortGenerate {
  id(): string {
    return createId();
  }
}

export const generate = tracer.startActiveSpan(
  "generate.infrastructure",
  () => new Generate(),
);
