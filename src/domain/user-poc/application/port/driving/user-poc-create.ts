import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivingUserPOCCreate
  extends PortDrivingUseCase<
    PortDrivingUserPOCCreateRequest,
    PortDrivingUserPOCCreateResponse
  > {
  execute(
    data: PortDrivingUserPOCCreateRequest,
  ): Promise<PortDrivingUserPOCCreateResponse>;
}
export type PortDrivingUserPOCCreateRequest = Omit<DomainUserPOC, "id">;
export type PortDrivingUserPOCCreateResponse = Pick<DomainUserPOC, "id">;
