import type { PortDatabase } from "../../../application/port/config/client/database.ts";
import type { PortElasticsearch } from "../../../application/port/config/client/elasticsearch.ts";
import type { PortClientConfig } from "../../../application/port/config/client/index.ts";
import type { PortRedis } from "../../../application/port/config/client/redis.ts";

export class ClientConfig implements PortClientConfig {
  constructor(
    private readonly _database: PortDatabase,
    private readonly _elasticsearch: PortElasticsearch,
    private readonly _redis: PortRedis,
  ) {}

  database(): PortDatabase {
    return this._database;
  }

  elasticsearch(): PortElasticsearch {
    return this._elasticsearch;
  }

  redis(): PortRedis {
    return this._redis;
  }
}
