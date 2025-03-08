import type { PortDatabase } from "./database.ts";
import type { PortFeature } from "./feature.ts";
import type { PortServer } from "./server.ts";

export interface PortConfig {
  database(): PortDatabase;
  feature(): PortFeature;
  server(): PortServer;
}
