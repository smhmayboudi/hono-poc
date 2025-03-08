import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivingUserPOCReadID
  extends PortDrivingUseCase<
    PortDrivingUserPOCReadIDRequest,
    PortDrivingUserPOCReadIDResponse
  > {
  execute(
    data: PortDrivingUserPOCReadIDRequest,
  ): Promise<PortDrivingUserPOCReadIDResponse>;
}
export type PortDrivingUserPOCReadIDRequest = Pick<DomainUserPOC, "id">;
export type PortDrivingUserPOCReadIDResponse = DomainUserPOC;
