import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationDeleteUserID {
  deleteUserId(
    data: PortDrivenUserPOCInformationDeleteUserIDRequest,
  ): Promise<PortDrivenUserPOCInformationDeleteUserIDResponse>;
}
export type PortDrivenUserPOCInformationDeleteUserIDRequest = Pick<
  DomainUserPOCInformation,
  "userId"
>;
export type PortDrivenUserPOCInformationDeleteUserIDResponse = void;
