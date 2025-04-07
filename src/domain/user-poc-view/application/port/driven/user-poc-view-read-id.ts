import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivenUserPOCViewReadID {
  readID(
    data: PortDrivenUserPOCViewReadIDRequest,
  ): Promise<PortDrivenUserPOCViewReadIDResponse>;
}
export type PortDrivenUserPOCViewReadIDRequest = Pick<DomainUserPOCView, "id">;
export type PortDrivenUserPOCViewReadIDResponse = DomainUserPOCView;
