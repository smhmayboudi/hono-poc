import type { PortAuth } from "../../../application/port/config/server/auth.ts";

export class Auth implements PortAuth {
  constructor(
    private readonly _appName: string,
    private readonly _baseURL: string,
    private readonly _secret: string,
  ) {}

  appName(): string {
    return this._appName;
  }

  baseURL(): string {
    return this._baseURL;
  }

  secret(): string {
    return this._secret;
  }
}
