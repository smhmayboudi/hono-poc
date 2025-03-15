import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationUpdateUserID {
  updateUserId(
    data: PortDrivenUserPOCInformationUpdateUserIDRequest,
  ): Promise<PortDrivenUserPOCInformationUpdateUserIDResponse>;
}
export type PortDrivenUserPOCInformationUpdateUserIDRequest =
  PartialUndefinable<Omit<DomainUserPOCInformation, "id" | "userId">> &
    Readonly<Pick<DomainUserPOCInformation, "userId">>;
export type PortDrivenUserPOCInformationUpdateUserIDResponse = void;
