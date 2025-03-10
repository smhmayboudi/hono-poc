import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivenUserPOCViewReadID {
  read(
    data: PortDrivenUserPOCViewReadIDRequest,
  ): Promise<PortDrivenUserPOCViewReadIDResponse>;
}
export type PortDrivenUserPOCViewReadIDRequest = Pick<DomainUserPOCView, "id">;
export type PortDrivenUserPOCViewReadIDResponse = DomainUserPOCView;
