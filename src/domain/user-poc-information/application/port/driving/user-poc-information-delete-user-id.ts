import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationDeleteUserId
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationDeleteUserIdRequest,
    PortDrivingUserPOCInformationDeleteUserIdResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationDeleteUserIdRequest,
  ): Promise<PortDrivingUserPOCInformationDeleteUserIdResponse>;
}
export type PortDrivingUserPOCInformationDeleteUserIdRequest = Pick<
  DomainUserPOCInformation,
  "userId"
>;
export type PortDrivingUserPOCInformationDeleteUserIdResponse = Pick<
  DomainUserPOCInformation,
  "userId"
>;
