import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationReadID
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationReadIDRequest,
    PortDrivingUserPOCInformationReadIDResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationReadIDRequest,
  ): Promise<PortDrivingUserPOCInformationReadIDResponse>;
}
export type PortDrivingUserPOCInformationReadIDRequest = Pick<
  DomainUserPOCInformation,
  "id"
>;
export type PortDrivingUserPOCInformationReadIDResponse =
  DomainUserPOCInformation;
