import api from "@opentelemetry/api-logs";
import { pino } from "pino";
import { merge } from "ts-deepmerge";

import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Logger implements PortLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: pino.LogFn = (...args: [any, ...any]) => {
    this.otelLogger.emit({
      body: {
        ...this.logger.bindings(),
        ...this.#args(args),
      },
      severityNumber: api.SeverityNumber.DEBUG,
    });
    this.logger.debug(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: pino.LogFn = (...args: [any, ...any]) => {
    this.otelLogger.emit({
      body: {
        ...this.logger.bindings(),
        ...this.#args(args),
      },
      severityNumber: api.SeverityNumber.ERROR,
    });
    this.logger.error(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatal: pino.LogFn = (...args: [any, ...any]) => {
    this.otelLogger.emit({
      body: {
        ...this.logger.bindings(),
        ...this.#args(args),
      },
      severityNumber: api.SeverityNumber.FATAL,
    });
    this.logger.fatal(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: pino.LogFn = (...args: [any, ...any]) => {
    this.otelLogger.emit({
      body: {
        ...this.logger.bindings(),
        ...this.#args(args),
      },
      severityNumber: api.SeverityNumber.INFO,
    });
    this.logger.info(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  silent: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.silent(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace: pino.LogFn = (...args: [any, ...any]) => {
    this.otelLogger.emit({
      body: {
        ...this.logger.bindings(),
        ...this.#args(args),
      },
      severityNumber: api.SeverityNumber.TRACE,
    });
    this.logger.trace(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: pino.LogFn = (...args: [any, ...any]) => {
    this.otelLogger.emit({
      body: {
        ...this.logger.bindings(),
        ...this.#args(args),
      },
      severityNumber: api.SeverityNumber.WARN,
    });
    this.logger.warn(...args);
  };

  level: pino.LevelWithSilentOrString;
  private logger: pino.Logger;
  private readonly otelLogger: api.Logger;
  private readonly rootLogger: pino.Logger;

  constructor(rootLogger: pino.Logger) {
    this.level = rootLogger.level;
    this.logger = rootLogger;
    this.otelLogger = api.logs.getLogger("hono-poc", "0.0.0");
    this.rootLogger = rootLogger.child({});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #args(args: Record<string, any>) {
    return Object.entries(args)
      .map((value) =>
        typeof value[1] === "string" ? { message: value[1] } : value[1],
      )
      .reduce(
        (previousValue, currentValue) => merge(previousValue, currentValue),
        {},
      );
  }

  /**
   * assign bindings to http log context
   */
  assign(bindings: pino.Bindings): void {
    this.logger = this.rootLogger.child({
      ...this.logger.bindings(),
      ...bindings,
    });
  }
}

export const logger = tracer.startActiveSpan(
  "logger.infrastructure",
  () => new Logger(pino({ level: "trace" })),
);
