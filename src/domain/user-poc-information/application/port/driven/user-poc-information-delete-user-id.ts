import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationDeleteUserId {
  deleteUserId(
    data: PortDrivenUserPOCInformationDeleteUserIdRequest,
  ): Promise<PortDrivenUserPOCInformationDeleteUserIdResponse>;
}
export type PortDrivenUserPOCInformationDeleteUserIdRequest = Pick<
  DomainUserPOCInformation,
  "userId"
>;
export type PortDrivenUserPOCInformationDeleteUserIdResponse = void;
