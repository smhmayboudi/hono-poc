import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivingUserPOCViewReadID
  extends PortDrivingUseCase<
    PortDrivingUserPOCViewReadIDRequest,
    PortDrivingUserPOCViewReadIDResponse
  > {
  execute(
    data: PortDrivingUserPOCViewReadIDRequest,
  ): Promise<PortDrivingUserPOCViewReadIDResponse>;
}
export type PortDrivingUserPOCViewReadIDRequest = Pick<DomainUserPOCView, "id">;
export type PortDrivingUserPOCViewReadIDResponse = DomainUserPOCView;
