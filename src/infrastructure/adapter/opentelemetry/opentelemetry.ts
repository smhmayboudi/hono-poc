import {
  type Context,
  type Meter,
  metrics,
  type Span,
  type SpanOptions,
  type Tracer,
} from "@opentelemetry/api";
import * as opentelemetry from "@opentelemetry/api";

import type {
  PortTracer,
  SpanName,
} from "../../application/port/opentelemetry/opentelemetry.ts";

export const iife = <T extends unknown[], U>(
  fn: (...args: T) => U,
  ...args: T
): U => fn(...args);

let rawMeter: Meter | undefined;
let rawTracer: Tracer | undefined;

export const tracer: PortTracer = {
  startActiveSpan<M extends string, F extends (span?: Span) => unknown>(
    name: SpanName<M>,
    optionsOrFn: SpanOptions | F,
    contextOrFn?: Context | F,
    fn?: F,
  ): ReturnType<F> {
    let options: SpanOptions = {};
    let context: Context = opentelemetry.context.active();

    if (typeof optionsOrFn === "function") {
      fn = optionsOrFn as F;
    } else {
      options = optionsOrFn;
    }

    if (contextOrFn) {
      if (typeof contextOrFn === "function") {
        fn = contextOrFn as F;
      } else {
        context = contextOrFn as Context;
      }
    }

    if (!fn) {
      throw new Error("No function provided to execute in span");
    }

    if (!opentelemetry) {
      return fn() as ReturnType<F>;
    }

    if (!rawMeter) {
      rawMeter = metrics.getMeter("hono-poc", "0.0.0");
    }
    if (!rawTracer) {
      rawTracer = opentelemetry.trace.getTracer("hono-poc", "0.0.0");
    }

    return iife(
      (otel, rawTracer) =>
        rawTracer.startActiveSpan(name, options, context, ((span: Span) => {
          try {
            span.setStatus({ code: otel.SpanStatusCode.OK });
            return fn(span);
          } catch (error) {
            span.recordException(
              error instanceof Error ? error.message : "unknown error",
            );
            span.setStatus({
              code: otel.SpanStatusCode.ERROR,
              message: error instanceof Error ? error.message : "unknown error",
            });
            throw error;
          } finally {
            span.end();
          }
        }) as F),
      opentelemetry,
      rawTracer,
    );
  },
};
