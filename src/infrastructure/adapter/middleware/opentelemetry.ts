import {
  type Meter,
  metrics,
  SpanStatusCode,
  trace,
  type Tracer,
} from "@opentelemetry/api";
import * as opentelemetry from "@opentelemetry/api";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { MiddlewareHandler } from "hono";

import type { Env } from "../../../env.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
// import { tracer } from "../opentelemetry/opentelemetry.ts";

let rawMeter: Meter | undefined;
let rawTracer: Tracer | undefined;

export const opentelemetryMiddleware =
  (
    config: PortConfig,
    logger: PortLogger,
  ): MiddlewareHandler<Env, "opentelemetry-middleware.infrastructure"> =>
  async (ctx, next) => {
    logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "opentelemetry-middleware.infrastructure",
      config,
    });
    if (!opentelemetry) {
      try {
        await next();
        if (ctx.error) {
          logger.error({ error: ctx.error.message });
        }
      } catch (error) {
        logger.error({
          error: error instanceof Error ? error.message : "unknown error",
        });
        throw error;
      }
      return;
    }
    if (!rawMeter) {
      rawMeter = metrics.getMeter("hono-poc", "0.0.0");
    }
    if (!rawTracer) {
      rawTracer = trace.getTracer("hono-poc", "0.0.0");
    }
    // return tracer.startActiveSpan(
    //   "opentelemetry-middleware.infrastructure",
    //   async (span) => {
    //     await next();
    //     if (ctx.error) {
    //       logger.error({ error: ctx.error.message });
    //       span?.recordException(ctx.error);
    //       span?.setStatus({
    //         code: SpanStatusCode.ERROR,
    //         message: ctx.error.message,
    //       });
    //     }
    //   },
    // );

    return rawTracer.startActiveSpan(
      "opentelemetry-middleware.infrastructure",
      async (span) => {
        try {
          span.setStatus({ code: SpanStatusCode.OK });
          await next();
          if (ctx.error) {
            logger.error({ error: ctx.error.message });
            span.recordException(ctx.error);
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: ctx.error.message,
            });
          }
        } catch (error) {
          logger.error({
            error: error instanceof Error ? error.message : "unknown error",
          });
          span.recordException(error as Error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : "unknown error",
          });
          throw error;
        } finally {
          span.end();
        }
      },
    );
  };
