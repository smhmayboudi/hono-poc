import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationUpdate
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationUpdateRequest,
    PortDrivingUserPOCInformationUpdateResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationUpdateRequest,
  ): Promise<PortDrivingUserPOCInformationUpdateResponse>;
}
export type PortDrivingUserPOCInformationUpdateRequest = PartialUndefinable<
  Omit<DomainUserPOCInformation, "id">
> &
  Readonly<Pick<DomainUserPOCInformation, "id">>;
export type PortDrivingUserPOCInformationUpdateResponse = Pick<
  DomainUserPOCInformation,
  "id"
>;
