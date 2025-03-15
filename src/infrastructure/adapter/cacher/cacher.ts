import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { type Cache, createCache } from "cache-manager";
import Keyv from "keyv";
import { LRUCache } from "lru-cache";

import type {
  CacherMap,
  PortCacher,
} from "../../application/port/cacher/cacher.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Cacher implements PortCacher {
  private readonly cache: Cache;

  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {
    this.cache = createCache({
      stores: [new Keyv({ store: new LRUCache({ max: 5000 }) })],
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

  key<K extends keyof CacherMap>(
    data: CacherMap[K],
  ): Record<keyof CacherMap, string> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "key-cacher.infrastructure",
      config: this.config,
      data,
    });
    this.logger.debug({});
    const key = Buffer.from(JSON.stringify(data)).toString("base64");

    return {
      DrivenUserPOCViewReadId: `user-poc-view-read-id.driven:${key}`,
    };
  }

  set<K extends keyof CacherMap>(
    key: string,
    value: CacherMap[K],
  ): Promise<CacherMap[K]> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "set-cacher.infrastructure",
      config: this.config,
      key,
    });
    this.logger.debug({});

    return this.cache.set(key, value);
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

export const cacher = (config: PortConfig, logger: PortLogger) =>
  tracer.startActiveSpan(
    "cacher.infrastructure",
    () => new Cacher(config, logger),
  );
