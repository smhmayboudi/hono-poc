import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivenUserPOCInformationRead {
  read(
    data: PortDrivenUserPOCInformationReadRequest,
  ): Promise<PortDrivenUserPOCInformationReadResponse>;
}
export type PortDrivenUserPOCInformationReadRequest =
  RequestQuery<DomainUserPOCInformation>;
export type PortDrivenUserPOCInformationReadResponse = {
  data: DomainUserPOCInformation[];
  pagination: { total: number };
};
