import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationDeleteUserId {
  delete(
    data: PortDrivenUserPOCInformationDeleteUserIdRequest,
  ): Promise<PortDrivenUserPOCInformationDeleteUserIdResponse>;
}
export type PortDrivenUserPOCInformationDeleteUserIdRequest = Pick<
  DomainUserPOCInformation,
  "userId"
>;
export type PortDrivenUserPOCInformationDeleteUserIdResponse = void;
