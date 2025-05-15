import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationCreate
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationCreateRequest,
    PortDrivingUserPOCInformationCreateResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationCreateRequest,
  ): Promise<PortDrivingUserPOCInformationCreateResponse>;
}
export type PortDrivingUserPOCInformationCreateRequest = Omit<
  DomainUserPOCInformation,
  "id"
>;
export type PortDrivingUserPOCInformationCreateResponse = Pick<
  DomainUserPOCInformation,
  "id"
>;
