import { type Cache, createCache } from "cache-manager";
import Keyv from "keyv";

import type { PortCacher } from "../../application/port/cacher/cacher.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Cacher implements PortCacher {
  private readonly cache: Cache;

  constructor() {
    this.cache = createCache({
      stores: [new Keyv()],
    });
  }

  del(key: string): Promise<boolean> {
    return this.cache.del(key);
  }

  key(
    data: unknown,
  ): Record<"userPOCViewReadDriven" | "userPOCViewReadIdDriven", string> {
    const key = Buffer.from(JSON.stringify(data)).toString("base64");

    return {
      userPOCViewReadDriven: `user-poc-view-read.driven:${key}`,
      userPOCViewReadIdDriven: `user-poc-view-read-id.driven:${key}`,
    };
  }

  wrap<T, F extends () => T | Promise<T>>(key: string, fn: F): ReturnType<F> {
    return this.cache.wrap<T>(key, fn) as ReturnType<F>;
  }
}

export const cacher = () =>
  tracer.startActiveSpan("cacher.infrastructure", () => new Cacher());
