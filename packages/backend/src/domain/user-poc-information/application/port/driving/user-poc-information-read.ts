import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationRead
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationReadRequest,
    PortDrivingUserPOCInformationReadResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationReadRequest,
  ): Promise<PortDrivingUserPOCInformationReadResponse>;
}
export type PortDrivingUserPOCInformationReadRequest =
  RequestQuery<DomainUserPOCInformation>;
export type PortDrivingUserPOCInformationReadResponse =
  DomainUserPOCInformation[];
