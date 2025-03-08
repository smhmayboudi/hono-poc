import type { PortDatabase } from "../../application/port/config/database.ts";

export class Database implements PortDatabase {
  constructor(private readonly _uri: string) {}

  uri(): string {
    return this._uri;
  }
}
