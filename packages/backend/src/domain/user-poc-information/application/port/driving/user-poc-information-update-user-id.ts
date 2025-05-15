import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationUpdateUserID
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationUpdateUserIDRequest,
    PortDrivingUserPOCInformationUpdateUserIDResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationUpdateUserIDRequest,
  ): Promise<PortDrivingUserPOCInformationUpdateUserIDResponse>;
}
export type PortDrivingUserPOCInformationUpdateUserIDRequest =
  PartialUndefinable<Omit<DomainUserPOCInformation, "id" | "userId">> &
    Readonly<Pick<DomainUserPOCInformation, "userId">>;
export type PortDrivingUserPOCInformationUpdateUserIDResponse = Pick<
  DomainUserPOCInformation,
  "userId"
>;
