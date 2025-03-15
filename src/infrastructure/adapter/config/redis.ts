import type { PortRedis } from "../../application/port/config/redis.ts";

export class Redis implements PortRedis {
  constructor(private readonly _url: string) {}

  url(): string {
    return this._url;
  }
}
