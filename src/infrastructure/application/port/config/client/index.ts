import type { PortDatabase } from "./database.ts";
import type { PortElasticsearch } from "./elasticsearch.ts";
import type { PortRedis } from "./redis.ts";

export interface PortClientConfig {
  database(): PortDatabase;
  elasticsearch(): PortElasticsearch;
  redis(): PortRedis;
}
