import {
  type Meter,
  metrics,
  type Span,
  SpanStatusCode,
  trace,
  type Tracer,
  type TracerProvider,
} from "@opentelemetry/api";
import * as opentelemetry from "@opentelemetry/api";
import { type Logger, logs } from "@opentelemetry/api-logs";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { MiddlewareHandler } from "hono";

import type { Env } from "../../../env.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";

let rawLogger: Logger | undefined;
let rawMeter: Meter | undefined;
let rawTracer: Tracer | undefined;

export const opentelemetryMiddleware = (
  config: PortConfig,
  logger: PortLogger,
  testTracerProvider?: TracerProvider,
): MiddlewareHandler<Env, "opentelemetry-middleware.infrastructure"> => {
  if (!rawLogger) {
    rawLogger = logs.getLogger("hono-poc", "0.0.0");
  }
  if (!rawMeter) {
    rawMeter = metrics.getMeter("hono-poc", "0.0.0");
  }
  if (!rawTracer) {
    const tracerProvider = testTracerProvider ?? trace.getTracerProvider();
    rawTracer = tracerProvider.getTracer("hono-poc", "0.0.0");
  }
  const counterHTTPRequestsTotal = rawMeter.createCounter(
    "http_requests_total",
    {
      description: "Total number of HTTP requests",
      valueType: opentelemetry.ValueType.INT,
    },
  );
  const histogramHTTPRequestDurationSeconds = rawMeter.createHistogram(
    "http_request_duration_seconds",
    {
      advice: {
        explicitBucketBoundaries: [
          0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5,
          10,
        ],
      },
      description: "Duration of HTTP requests in seconds",
      unit: "s",
    },
  );

  return async (ctx, next) => {
    logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "opentelemetry-middleware.infrastructure",
      config,
    });
    if (!opentelemetry) {
      try {
        await next();
        if (ctx.error) {
          logger.error(ctx.error.message);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error("unknown error");
        logger.error(err.message);
        throw error;
      }
      return;
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

    return rawTracer?.startActiveSpan(
      "opentelemetry-middleware.infrastructure",
      async (span) => {
        let duration = 0;
        try {
          span.setStatus({ code: SpanStatusCode.OK });
          const start = performance.now();
          await next();
          const end = performance.now();
          duration = (end - start) / 1000;
          if (ctx.error) {
            handleSpanError(span, ctx.error);
          } else {
            span.end();
          }
        } catch (error) {
          handleSpanError(span, error);
          throw error;
        } finally {
          counterHTTPRequestsTotal.add(1, {
            method: ctx.req.method,
            ok: String(ctx.res.ok),
            path: ctx.req.routePath,
            status: ctx.res.status.toString(),
          });
          histogramHTTPRequestDurationSeconds.record(duration, {
            method: ctx.req.method,
            ok: String(ctx.res.ok),
            path: ctx.req.routePath,
            status: ctx.res.status.toString(),
          });
        }
      },
    );
  };
};
