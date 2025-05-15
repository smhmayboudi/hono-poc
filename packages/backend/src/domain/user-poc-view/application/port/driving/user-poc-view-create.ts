import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivingUserPOCViewCreate
  extends PortDrivingUseCase<
    PortDrivingUserPOCViewCreateRequest,
    PortDrivingUserPOCViewCreateResponse
  > {
  execute(
    data: PortDrivingUserPOCViewCreateRequest,
  ): Promise<PortDrivingUserPOCViewCreateResponse>;
}
export type PortDrivingUserPOCViewCreateRequest = Omit<DomainUserPOCView, "id">;
export type PortDrivingUserPOCViewCreateResponse = Pick<
  DomainUserPOCView,
  "id"
>;
