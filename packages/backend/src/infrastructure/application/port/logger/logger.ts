import type { pino } from "pino";

export interface PortLogger extends pino.BaseLogger {
  assign(bindings: pino.Bindings): void;
}
