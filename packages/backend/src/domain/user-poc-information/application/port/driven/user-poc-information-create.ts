import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationCreate {
  create(
    data: PortDrivenUserPOCInformationCreateRequest,
  ): Promise<PortDrivenUserPOCInformationCreateResponse>;
}
export type PortDrivenUserPOCInformationCreateRequest =
  DomainUserPOCInformation;
export type PortDrivenUserPOCInformationCreateResponse = void;
