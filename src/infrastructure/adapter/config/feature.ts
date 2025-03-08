import type { PortFeature } from "../../application/port/config/feature.ts";

export class Feature implements PortFeature {
  constructor(private readonly _brandOriginCountry: boolean) {}

  brandOriginCountry(): boolean {
    return this._brandOriginCountry;
  }
}
