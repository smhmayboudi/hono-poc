import { pino } from "pino";

import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Logger implements PortLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.debug(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.error(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fatal: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.fatal(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.info(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  silent: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.silent(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.trace(...args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: pino.LogFn = (...args: [any, ...any]) => {
    this.logger.warn(...args);
  };

  level: pino.LevelWithSilentOrString;
  logger: pino.Logger;
  rootLogger: pino.Logger;

  constructor(rootLogger: pino.Logger) {
    this.level = "trace";
    this.logger = rootLogger;
    this.rootLogger = rootLogger.child({});
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
