import type { PortAuth } from "../../../application/port/config/server/auth.ts";
import type { PortFeature } from "../../../application/port/config/server/feature.ts";
import type { PortServerConfig } from "../../../application/port/config/server/index.ts";
import type { PortServer } from "../../../application/port/config/server/server.ts";

export class ServerConfig implements PortServerConfig {
  constructor(
    private readonly _auth: PortAuth,
    private readonly _feature: PortFeature,
    private readonly _server: PortServer,
  ) {}

  auth(): PortAuth {
    return this._auth;
  }

  feature(): PortFeature {
    return this._feature;
  }

  server(): PortServer {
    return this._server;
  }
}
