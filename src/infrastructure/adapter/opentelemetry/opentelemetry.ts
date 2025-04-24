import {
  type Context,
  type Meter,
  metrics,
  type Span,
  type SpanOptions,
  type Tracer,
} from "@opentelemetry/api";
import * as opentelemetry from "@opentelemetry/api";
import { type Logger, logs } from "@opentelemetry/api-logs";

import type {
  PortTracer,
  SpanName,
} from "../../application/port/opentelemetry/opentelemetry.ts";

let rawLogger: Logger | undefined;
let rawMeter: Meter | undefined;
let rawTracer: Tracer | undefined;

export class Trace implements PortTracer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startActiveSpan<M extends string, F extends (span?: Span) => any>(
    name: SpanName<M>,
    optionsOrFn: SpanOptions | F,
    contextOrFn?: Context | F,
    fn?: F,
  ): ReturnType<F> extends Promise<infer U> ? Promise<U> : ReturnType<F> {
    let options: SpanOptions = {};
    let context: Context = opentelemetry.context.active();
    let callback: F;

    // Parse arguments
    if (typeof optionsOrFn === "function") {
      callback = optionsOrFn as F;
    } else {
      options = optionsOrFn;
      if (typeof contextOrFn === "function") {
        callback = contextOrFn;
      } else {
        if (contextOrFn) {
          context = contextOrFn;
        }
        callback = fn!;
      }
    }

    if (!callback) {
      throw new Error("No function provided to execute in span");
    }

    if (!opentelemetry) {
      return callback();
    }

    if (!rawLogger) {
      rawLogger = logs.getLogger("hono-poc", "0.0.0");
    }
    if (!rawMeter) {
      rawMeter = metrics.getMeter("hono-poc", "0.0.0");
    }
    if (!rawTracer) {
      rawTracer = opentelemetry.trace.getTracer("hono-poc", "0.0.0");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSpanError = (span: Span, error: any) => {
      const err = error instanceof Error ? error : new Error("unknown error");
      span.recordException(err);
      span.setStatus({
        code: opentelemetry.SpanStatusCode.ERROR,
        message: err.message,
      });
      span.end();
    };

    return rawTracer.startActiveSpan(name, options, context, (span: Span) => {
      try {
        span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
        const result = callback(span);
        if (result && typeof result.then === "function") {
          return (result as Promise<unknown>)
            .then((value) => {
              span.end();
              return value;
            })
            .catch((error) => {
              handleSpanError(span, error);
              throw error;
            });
        }
        span.end();
        return result;
      } catch (error) {
        handleSpanError(span, error);
        throw error;
      }
    });
  }
}

export const tracer = new Trace();
