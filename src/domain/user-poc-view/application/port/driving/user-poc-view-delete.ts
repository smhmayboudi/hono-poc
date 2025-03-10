import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivingUserPOCViewDelete
  extends PortDrivingUseCase<
    PortDrivingUserPOCViewDeleteRequest,
    PortDrivingUserPOCViewDeleteResponse
  > {
  execute(
    data: PortDrivingUserPOCViewDeleteRequest,
  ): Promise<PortDrivingUserPOCViewDeleteResponse>;
}
export type PortDrivingUserPOCViewDeleteRequest = Pick<DomainUserPOCView, "id">;
export type PortDrivingUserPOCViewDeleteResponse = Pick<
  DomainUserPOCView,
  "id"
>;
