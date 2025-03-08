import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationReadID {
  readID(
    data: PortDrivenUserPOCInformationReadIDRequest,
  ): Promise<PortDrivenUserPOCInformationReadIDResponse>;
}
export type PortDrivenUserPOCInformationReadIDRequest = Pick<
  DomainUserPOCInformation,
  "id"
>;
export type PortDrivenUserPOCInformationReadIDResponse =
  DomainUserPOCInformation;
