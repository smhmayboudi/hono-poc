import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivenUserPOCDelete {
  delete(
    data: PortDrivenUserPOCDeleteRequest,
  ): Promise<PortDrivenUserPOCDeleteResponse>;
}
export type PortDrivenUserPOCDeleteRequest = Pick<DomainUserPOC, "id">;
export type PortDrivenUserPOCDeleteResponse = void;
