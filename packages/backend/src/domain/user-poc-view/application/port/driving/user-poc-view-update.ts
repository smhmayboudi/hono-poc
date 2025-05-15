import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivingUserPOCViewUpdate
  extends PortDrivingUseCase<
    PortDrivingUserPOCViewUpdateRequest,
    PortDrivingUserPOCViewUpdateResponse
  > {
  execute(
    data: PortDrivingUserPOCViewUpdateRequest,
  ): Promise<PortDrivingUserPOCViewUpdateResponse>;
}
export type PortDrivingUserPOCViewUpdateRequest = PartialUndefinable<
  Omit<DomainUserPOCView, "id">
> &
  Readonly<Pick<DomainUserPOCView, "id">>;
export type PortDrivingUserPOCViewUpdateResponse = Pick<
  DomainUserPOCView,
  "id"
>;
