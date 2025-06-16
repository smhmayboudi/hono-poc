import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainCSP } from "../../domain/csp.ts";

export interface PortDrivenCSPRead {
  read(data: PortDrivenCSPReadRequest): Promise<PortDrivenCSPReadResponse>;
}
export type PortDrivenCSPReadRequest = RequestQuery<DomainCSP>;
export type PortDrivenCSPReadResponse = {
  data: DomainCSP[];
  pagination: { total: number };
};
