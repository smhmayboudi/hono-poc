import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivingUserPOCRead
  extends PortDrivingUseCase<
    PortDrivingUserPOCReadRequest,
    PortDrivingUserPOCReadResponse
  > {
  execute(
    data: PortDrivingUserPOCReadRequest,
  ): Promise<PortDrivingUserPOCReadResponse>;
}
export type PortDrivingUserPOCReadRequest = RequestQuery<DomainUserPOC>;
export type PortDrivingUserPOCReadResponse = {
  data: DomainUserPOC[];
  pagination: { total: number };
};
