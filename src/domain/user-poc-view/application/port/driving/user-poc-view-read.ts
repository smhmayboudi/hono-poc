import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivingUserPOCViewRead
  extends PortDrivingUseCase<
    PortDrivingUserPOCViewReadRequest,
    PortDrivingUserPOCViewReadResponse
  > {
  execute(
    data: PortDrivingUserPOCViewReadRequest,
  ): Promise<PortDrivingUserPOCViewReadResponse>;
}
export type PortDrivingUserPOCViewReadRequest = RequestQuery<DomainUserPOCView>;
export type PortDrivingUserPOCViewReadResponse = DomainUserPOCView[];
