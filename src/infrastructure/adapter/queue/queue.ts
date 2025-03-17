import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import type {
  Job,
  JobOptions,
  ProcessCallbackFunction,
  ProcessPromiseFunction,
} from "bull";
import Bull from "bull";

import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import type { PortQueue } from "../../application/port/queue/queue.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Queue<T> implements PortQueue<T> {
  private readonly queue: Bull.Queue<T>;
  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
    name: string,
  ) {
    this.queue = new Bull<T>(name, `${config.redis().url()}/2`);

    this.queue.on("lock-extension-failed", (job, error) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "lock-extension-failed-queue.infrastructure",
        config,
        error,
        job,
      });
      logger.error({});
    });

    this.queue.on("error", (error) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "error-queue.infrastructure",
        config,
        error,
      });
      logger.error({});
    });

    this.queue.on("waiting", (jobId) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "waiting-queue.infrastructure",
        config,
        jobId,
      });
      logger.debug({});
    });

    this.queue.on("active", (job, jobPromise) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "active-queue.infrastructure",
        config,
        job,
        jobPromise,
      });
      logger.debug({});
    });

    this.queue.on("stalled", (job) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "stalled-queue.infrastructure",
        config,
        job,
      });
      logger.debug({});
    });

    this.queue.on("progress", (job, progress) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "progress-queue.infrastructure",
        config,
        job,
        progress,
      });
      logger.debug({});
    });

    this.queue.on("completed", (job, result) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "completed-queue.infrastructure",
        config,
        job,
        result,
      });
      logger.debug({});
    });

    this.queue.on("failed", (job, error) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "failed-queue.infrastructure",
        config,
        job,
        error,
      });
      logger.error({});
    });

    this.queue.on("paused", () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "paused-queue.infrastructure",
        config,
      });
      logger.debug({});
    });

    this.queue.on("resumed", () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "resumed-queue.infrastructure",
        config,
      });
      logger.debug({});
    });

    this.queue.on("removed", (job) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "removed-queue.infrastructure",
        config,
        job,
      });
      logger.debug({});
    });

    this.queue.on("cleaned", (jobs, type) => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "cleaned-queue.infrastructure",
        config,
        jobs,
        type,
      });
      logger.debug({});
    });

    this.queue.on("drained", () => {
      logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "drained-queue.infrastructure",
        config,
      });
      logger.debug({});
    });
  }

  add(data: T, opts?: JobOptions): Promise<Job<T>> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "add-queue.infrastructure",
      config: this.config,
      data,
      opts,
    });
    this.logger.debug({});

    return this.queue.add(data, opts);
  }

  process(
    callback: ProcessPromiseFunction<T> | ProcessCallbackFunction<T>,
  ): Promise<void> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "process-queue.infrastructure",
      config: this.config,
    });
    this.logger.debug({});

    return this.queue.process(callback);
  }
}

export const queue = <T>(
  config: PortConfig,
  logger: PortLogger,
  name: string,
) =>
  tracer.startActiveSpan(
    "queue.infrastructure",
    () => new Queue<T>(config, logger, name),
  );
