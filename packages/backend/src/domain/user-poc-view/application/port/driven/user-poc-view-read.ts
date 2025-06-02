import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivenUserPOCViewRead {
  read(
    data: PortDrivenUserPOCViewReadRequest,
  ): Promise<PortDrivenUserPOCViewReadResponse>;
}
export type PortDrivenUserPOCViewReadRequest = RequestQuery<DomainUserPOCView>;
export type PortDrivenUserPOCViewReadResponse = {
  data: DomainUserPOCView[];
  pagination: { total: number };
};
