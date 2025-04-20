import {
  type Context,
  type Meter,
  metrics,
  type Span,
  type SpanOptions,
  type Tracer,
} from "@opentelemetry/api";
import * as opentelemetry from "@opentelemetry/api";
import { type Logger, logs, SeverityNumber } from "@opentelemetry/api-logs";

import type {
  PortTracer,
  SpanName,
} from "../../application/port/opentelemetry/opentelemetry.ts";

export const iife = <T extends unknown[], U>(
  fn: (...args: T) => U,
  ...args: T
): U => fn(...args);

let rawLogger: Logger | undefined;
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
    let callback: F;
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
      return callback() as ReturnType<F>;
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
    const counter = rawMeter.createCounter("iife.count");

    return iife(
      (opentelemetry, counter, rawLogger, rawTracer) => {
        rawLogger.emit({
          body: name,
          severityNumber: SeverityNumber.INFO,
        });
        counter.add(1);
        return rawTracer.startActiveSpan(name, options, context, ((
          span: Span,
        ) => {
          try {
            span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
            return callback(span);
          } catch (error) {
            rawLogger.emit({
              attributes: {
                "error.stack": error instanceof Error ? error.stack : undefined,
              },
              body: error instanceof Error ? error.message : "unknown error",
              severityNumber: SeverityNumber.ERROR,
            });
            span.recordException(
              error instanceof Error ? error.message : "unknown error",
            );
            span.setStatus({
              code: opentelemetry.SpanStatusCode.ERROR,
              message: error instanceof Error ? error.message : "unknown error",
            });
            throw error;
          } finally {
            span.end();
          }
        }) as F);
      },
      opentelemetry,
      counter,
      rawLogger,
      rawTracer,
    );
  },
};
