import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivenUserPOCCreate {
  create(
    data: PortDrivenUserPOCCreateRequest,
  ): Promise<PortDrivenUserPOCCreateResponse>;
}
export type PortDrivenUserPOCCreateRequest = DomainUserPOC;
export type PortDrivenUserPOCCreateResponse = void;
