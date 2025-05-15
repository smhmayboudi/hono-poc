import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationDelete
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationDeleteRequest,
    PortDrivingUserPOCInformationDeleteResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationDeleteRequest,
  ): Promise<PortDrivingUserPOCInformationDeleteResponse>;
}
export type PortDrivingUserPOCInformationDeleteRequest = Pick<
  DomainUserPOCInformation,
  "id"
>;
export type PortDrivingUserPOCInformationDeleteResponse = Pick<
  DomainUserPOCInformation,
  "id"
>;
