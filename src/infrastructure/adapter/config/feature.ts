import type { PortFeature } from "../../application/port/config/feature.ts";

export class Feature implements PortFeature {
  constructor(private readonly _userPOCFullname: boolean) {}

  userPOCFullname(): boolean {
    return this._userPOCFullname;
  }
}
