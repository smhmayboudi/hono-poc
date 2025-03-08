import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationDelete {
  delete(
    data: PortDrivenUserPOCInformationDeleteRequest,
  ): Promise<PortDrivenUserPOCInformationDeleteResponse>;
}
export type PortDrivenUserPOCInformationDeleteRequest = Pick<
  DomainUserPOCInformation,
  "id"
>;
export type PortDrivenUserPOCInformationDeleteResponse = void;
