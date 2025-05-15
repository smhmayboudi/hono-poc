import { createId } from "@paralleldrive/cuid2";

import type { PortGenerate } from "../../application/port/generate/generate.ts";
import type { PortTracer } from "../../application/port/opentelemetry/opentelemetry.ts";

export class Generate implements PortGenerate {
  id(): string {
    return createId();
  }
}

export const generate = (tracer: PortTracer) =>
  tracer.startActiveSpan("generate.infrastructure", () => new Generate());
