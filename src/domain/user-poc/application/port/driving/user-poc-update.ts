import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivingUserPOCUpdate
  extends PortDrivingUseCase<
    PortDrivingUserPOCUpdateRequest,
    PortDrivingUserPOCUpdateResponse
  > {
  execute(
    data: PortDrivingUserPOCUpdateRequest,
  ): Promise<PortDrivingUserPOCUpdateResponse>;
}
export type PortDrivingUserPOCUpdateRequest = PartialUndefinable<
  Omit<DomainUserPOC, "id">
> &
  Readonly<Pick<DomainUserPOC, "id">>;
export type PortDrivingUserPOCUpdateResponse = Pick<DomainUserPOC, "id">;
