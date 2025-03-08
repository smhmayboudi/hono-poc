import type { PortServer } from "../../application/port/config/server.ts";

export class Server implements PortServer {
  constructor(private readonly _port: number) {}

  port(): number {
    return this._port;
  }
}
