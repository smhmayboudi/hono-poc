import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivenUserPOCRead {
  read(
    data: PortDrivenUserPOCReadRequest,
  ): Promise<PortDrivenUserPOCReadResponse>;
}
export type PortDrivenUserPOCReadRequest = RequestQuery<DomainUserPOC>;
export type PortDrivenUserPOCReadResponse = {
  data: DomainUserPOC[];
  pagination: { total: number };
};
