import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type { Context, MiddlewareHandler } from "hono";
import { pino } from "pino";
import { merge } from "ts-deepmerge";

import type { Env } from "../../../env.ts";
import { Logger } from "../logger/logger.ts";

export interface LoggerOption {
  /**
   * http request log options
   */
  http?:
    | false
    | {
        /**
         * custom on request bindings
         * @default
         * (ctx) => ({
         *   req: {
         *     headers: ctx.req.header(),
         *     method: ctx.req.method,
         *     url: ctx.req.path,
         *   },
         * })
         */
        onReqBindings?: (ctx: Context) => pino.Bindings;
        /**
         * custom on request level
         * @default (ctx) => "info"
         */
        onReqLevel?: (ctx: Context) => pino.Level;
        /**
         * custom on request message
         * @description set to false to disable
         * @default false // disable
         * @example
         * (ctx) => "Request received"
         */
        onReqMessage?: false | ((ctx: Context) => string);
        /**
         * custom on response bindings
         * @default
         * (ctx) => ({
         *   res: {
         *     status: ctx.res.status,
         *     headers: ctx.res.headers,
         *   },
         * })
         */
        onResBindings?: (ctx: Context) => pino.Bindings;
        /**
         * custom on response level
         * @default (ctx) => ctx.error ? "error" : "info"
         * @example
         * // always trace
         * () => "trace"
         * @example
         * // 4xx=warn, 5xx=error, default=info
         * (ctx) => {
         *   if (ctx.status >= 500) return "error";
         *   if (ctx.status >= 400) return "warn";
         *   return "info";
         * }
         */
        onResLevel?: (ctx: Context) => pino.Level;
        /**
         * custom on response message
         * @description set to false to disable
         * @default (ctx) => ctx.error ? ctx.error.message : "Request completed"
         */
        onResMessage?: false | ((ctx: Context) => string);
        /**
         * custom request id
         * @description set to false to disable
         * @default () => n + 1
         * @example
         * // paralleldrive/cuid2
         * () => createId()
         */
        reqId?: false | (() => string);
        /**
         * adding response time to bindings
         * @default true
         */
        responseTime?: boolean;
      };

  /**
   * a pino instance or pino options
   */
  pino?: pino.Logger | pino.LoggerOptions | pino.DestinationStream;
}

const isPinoLogger = (value: unknown): value is pino.Logger =>
  typeof value === "object" &&
  value !== null &&
  "child" in value &&
  typeof value.child === "function";

export const loggerMiddleware: (
  loggerOption?: LoggerOption,
) => MiddlewareHandler<Env, "logger-middleware.infrastructure"> = (
  loggerOption,
) => {
  let defaultReqId = 0n;
  const defaultReqIdGenerator = () => (defaultReqId += 1n);
  const rootLogger = isPinoLogger(loggerOption?.pino)
    ? loggerOption.pino
    : pino(loggerOption?.pino);

  return async (ctx, next) => {
    const logger = new Logger(rootLogger);
    if (loggerOption?.http === false) {
      await next();
      return;
    }
    logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "logger-middleware.infrastructure",
    });
    let bindings = createRequestBindings(
      ctx,
      loggerOption,
      defaultReqIdGenerator,
    );
    logRequest(ctx, logger, bindings, loggerOption);
    const startTime = performance.now();
    await next();
    const resTime = getResponseTime(startTime, loggerOption);
    bindings = addResponseBindings(ctx, bindings, resTime, loggerOption);
    logResponse(ctx, logger, bindings, loggerOption);
  };
};

/**
 * Check if http logging options are provided.
 */
const hasHttpOptions = (
  http: LoggerOption["http"],
): http is Exclude<LoggerOption["http"], false> => http !== false;

/**
 * Create bindings for the request based on the provided options
 */
const createRequestBindings = (
  ctx: Context,
  loggerOption?: LoggerOption,
  defaultReqIdGenerator?: () => bigint,
): pino.Bindings => {
  const httpOptions = loggerOption?.http;
  const bindings =
    hasHttpOptions(httpOptions) && httpOptions?.onReqBindings
      ? httpOptions?.onReqBindings(ctx)
      : {
          req: {
            headers: ctx.req.header(),
            method: ctx.req.method,
            url: ctx.req.path,
          },
        };
  if (hasHttpOptions(httpOptions) && httpOptions?.reqId !== false) {
    bindings["reqId"] = httpOptions?.reqId?.() ?? defaultReqIdGenerator?.();
  }

  return bindings;
};

/**
 * Log the request based on custom or default log level and message
 */
const logRequest = (
  ctx: Context,
  logger: Logger,
  bindings: pino.Bindings,
  loggerOption?: LoggerOption,
) => {
  const httpOptions = loggerOption?.http;
  if (hasHttpOptions(httpOptions) && httpOptions?.onReqMessage !== false) {
    const msg = httpOptions?.onReqMessage?.(ctx) ?? "Request received";
    logger[httpOptions?.onReqLevel?.(ctx) ?? "debug"](bindings, msg);
  }
};

/**
 * Calculate the response time based on request start time
 */
const getResponseTime = (
  startTime: number,
  loggerOption?: LoggerOption,
): number | undefined => {
  const httpOptions = loggerOption?.http;
  if (hasHttpOptions(httpOptions) && (httpOptions?.responseTime ?? true)) {
    const endTime = performance.now();
    return Math.round(endTime - startTime);
  }

  // Explicitly return `undefined` if response time is not required
  return undefined;
};

/**
 * Merge response-related bindings into the current bindings
 */
const addResponseBindings = (
  ctx: Context,
  bindings: pino.Bindings,
  responseTime?: number,
  loggerOption?: LoggerOption,
): pino.Bindings => {
  const httpOptions = loggerOption?.http;
  const onResBindings =
    hasHttpOptions(httpOptions) && httpOptions?.onResBindings
      ? httpOptions?.onResBindings(ctx)
      : {
          res: {
            headers: ctx.res.headers,
            status: ctx.res.status,
          },
        };
  if (responseTime !== undefined) {
    bindings["responseTime"] = responseTime;
  }

  return merge(bindings, onResBindings);
};

/**
 * Log the response with the appropriate level and message
 */
const logResponse = (
  ctx: Context,
  logger: Logger,
  bindings: pino.Bindings,
  loggerOption?: LoggerOption,
) => {
  const httpOptions = loggerOption?.http;
  if (hasHttpOptions(httpOptions) && httpOptions?.onResMessage !== false) {
    const msg =
      httpOptions?.onResMessage?.(ctx) ??
      (ctx.error ? ctx.error.message : "Request completed");
    logger[httpOptions?.onResLevel?.(ctx) ?? (ctx.error ? "error" : "debug")](
      bindings,
      msg,
    );
  }
};
