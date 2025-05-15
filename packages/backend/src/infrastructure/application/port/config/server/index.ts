import type { PortAuth } from "./auth.ts";
import type { PortFeature } from "./feature.ts";
import type { PortServer } from "./server.ts";

export interface PortServerConfig {
  auth(): PortAuth;
  feature(): PortFeature;
  server(): PortServer;
}
