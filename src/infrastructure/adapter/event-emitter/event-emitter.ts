import { EventEmitter as NodeEventEmitter } from "node:events";

import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../application/port/config/config.ts";
import type {
  EventEmitterMap,
  PortEventEmitter,
} from "../../application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import type { PortTracer } from "../../application/port/opentelemetry/opentelemetry.ts";

export class EventEmitter implements PortEventEmitter {
  #nodeEventEmitter: NodeEventEmitter;

  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
    // private readonly tracer: PortTracer,
  ) {
    this.#nodeEventEmitter = new NodeEventEmitter({ captureRejections: true });
  }
  emit<K extends keyof EventEmitterMap>(
    event: K,
    data: EventEmitterMap[K],
  ): void {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "emit-event-emitter.infrastructure",
      config: this.config,
      data,
      event,
    });
    this.logger.debug({});
    this.#nodeEventEmitter.emit(event, data);
  }
  off<K extends keyof EventEmitterMap>(
    event: K,
    listener: (data: EventEmitterMap[K]) => void,
  ): void {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "off-event-emitter.infrastructure",
      config: this.config,
      event,
    });
    this.logger.debug({});
    this.#nodeEventEmitter.off(event, listener);
  }
  on<K extends keyof EventEmitterMap>(
    event: K,
    listener: (data: EventEmitterMap[K]) => void,
  ): void {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "on-event-emitter.infrastructure",
      config: this.config,
      event,
    });
    this.logger.debug({});
    this.#nodeEventEmitter.on(event, listener);
  }
}

export const eventEmitter = (
  config: PortConfig,
  logger: PortLogger,
  tracer: PortTracer,
) =>
  tracer.startActiveSpan(
    "event-emitter.infrastructure",
    () => new EventEmitter(config, logger),
  );
