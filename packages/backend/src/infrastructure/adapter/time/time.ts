import type { PortTracer } from "../../application/port/opentelemetry/opentelemetry.ts";
import type { PortTime } from "../../application/port/time/time.ts";

export class Time implements PortTime {
  now(): Date {
    return new Date();
  }
}

export const time = (tracer: PortTracer) =>
  tracer.startActiveSpan("time.infrastructure", () => new Time());
