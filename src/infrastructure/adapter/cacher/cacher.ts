import KeyvRedis from "@keyv/redis";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { type Cache, createCache } from "cache-manager";
import Keyv from "keyv";

import type {
  CacherMap,
  PortCacher,
} from "../../application/port/cacher/cacher.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import type { PortTracer } from "../../application/port/opentelemetry/opentelemetry.ts";

export class Cacher implements PortCacher {
  private readonly cache: Cache;

  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
    // private readonly tracer: PortTracer,
  ) {
    const keyv = new Keyv({
      store: new KeyvRedis(
        { url: `${this.config.client().redis().url()}/1` },
        { keyPrefixSeparator: ":" },
      ),
    });
    // keyv.on("clear", () => {});
    // keyv.on("disconnect", () => {});
    keyv.on("error", (err) => {
      this.logger.error(err);
    });
    this.cache = createCache({
      stores: [keyv],
    });
  }

  del(key: string): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "del-cacher.infrastructure",
      config: this.config,
      key,
    });
    this.logger.debug({});

    return this.cache.del(key);
  }

  get<K extends keyof CacherMap>(
    key: string,
  ): Promise<CacherMap[K]["Response"] | null> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "get-cacher.infrastructure",
      config: this.config,
      key,
    });
    this.logger.debug({});

    return this.cache.get<CacherMap[K]["Response"]>(key);
  }

  key<K extends keyof CacherMap>(
    data: CacherMap[K]["Request"],
  ): Record<keyof CacherMap, string> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "key-cacher.infrastructure",
      config: this.config,
      data,
    });
    this.logger.debug({});
    const key = Buffer.from(JSON.stringify(data)).toString("base64");

    return {
      AuthSecondaryStorage: `auth-secondary-storage:${key}`,
      DrivenUserPOCViewReadID: `user-poc-view-read-id.driven:${key}`,
    };
  }

  set<K extends keyof CacherMap>(
    key: string,
    value: CacherMap[K]["Response"],
    ttl?: number,
  ): Promise<CacherMap[K]["Response"]> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "set-cacher.infrastructure",
      config: this.config,
      key,
    });
    this.logger.debug({});

    return this.cache.set<CacherMap[K]["Response"]>(key, value, ttl);
  }

  wrap<T, F extends () => T | Promise<T>>(key: string, fn: F): ReturnType<F> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "wrap-cacher.infrastructure",
      config: this.config,
      key,
    });
    this.logger.debug({});

    return this.cache.wrap<T>(key, fn) as ReturnType<F>;
  }
}

export const cacher = (
  config: PortConfig,
  logger: PortLogger,
  tracer: PortTracer,
) =>
  tracer.startActiveSpan(
    "cacher.infrastructure",
    () => new Cacher(config, logger),
  );
