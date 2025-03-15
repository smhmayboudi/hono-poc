import type { PortDatabase } from "./database.ts";
import type { PortElasticsearch } from "./elasticsearch.ts";
import type { PortFeature } from "./feature.ts";
import type { PortRedis } from "./redis.ts";
import type { PortServer } from "./server.ts";

export interface PortConfig {
  database(): PortDatabase;
  elasticsearch(): PortElasticsearch;
  feature(): PortFeature;
  redis(): PortRedis;
  server(): PortServer;
}
