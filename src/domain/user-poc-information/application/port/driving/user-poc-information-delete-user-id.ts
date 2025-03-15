import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationDeleteUserID
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationDeleteUserIDRequest,
    PortDrivingUserPOCInformationDeleteUserIDResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationDeleteUserIDRequest,
  ): Promise<PortDrivingUserPOCInformationDeleteUserIDResponse>;
}
export type PortDrivingUserPOCInformationDeleteUserIDRequest = Pick<
  DomainUserPOCInformation,
  "userId"
>;
export type PortDrivingUserPOCInformationDeleteUserIDResponse = Pick<
  DomainUserPOCInformation,
  "userId"
>;
