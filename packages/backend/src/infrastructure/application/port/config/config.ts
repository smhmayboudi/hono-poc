import type { PortClientConfig } from "./client/index.ts";
import type { PortServerConfig } from "./server/index.ts";

export interface PortConfig {
  client(): PortClientConfig;
  server(): PortServerConfig;
}
