import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivingUserPOCDelete
  extends PortDrivingUseCase<
    PortDrivingUserPOCDeleteRequest,
    PortDrivingUserPOCDeleteResponse
  > {
  execute(
    data: PortDrivingUserPOCDeleteRequest,
  ): Promise<PortDrivingUserPOCDeleteResponse>;
}
export type PortDrivingUserPOCDeleteRequest = Pick<DomainUserPOC, "id">;
export type PortDrivingUserPOCDeleteResponse = Pick<DomainUserPOC, "id">;
