import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationUpdate {
  update(
    data: PortDrivenUserPOCInformationUpdateRequest,
  ): Promise<PortDrivenUserPOCInformationUpdateResponse>;
}
export type PortDrivenUserPOCInformationUpdateRequest = PartialUndefinable<
  Omit<DomainUserPOCInformation, "id">
> &
  Readonly<Pick<DomainUserPOCInformation, "id">>;
export type PortDrivenUserPOCInformationUpdateResponse = void;
