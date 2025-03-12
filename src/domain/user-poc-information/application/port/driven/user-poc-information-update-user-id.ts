import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationUpdateUserId {
  updateUserId(
    data: PortDrivenUserPOCInformationUpdateUserIdRequest,
  ): Promise<PortDrivenUserPOCInformationUpdateUserIdResponse>;
}
export type PortDrivenUserPOCInformationUpdateUserIdRequest =
  PartialUndefinable<Omit<DomainUserPOCInformation, "id" | "userId">> &
    Readonly<Pick<DomainUserPOCInformation, "userId">>;
export type PortDrivenUserPOCInformationUpdateUserIdResponse = void;
