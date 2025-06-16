import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { RequestQuery } from "../../../../../shared/application/port/request-query.ts";
import type { DomainCSP } from "../../domain/csp.ts";

export interface PortDrivingCSPRead
  extends PortDrivingUseCase<
    PortDrivingCSPReadRequest,
    PortDrivingCSPReadResponse
  > {
  execute(data: PortDrivingCSPReadRequest): Promise<PortDrivingCSPReadResponse>;
}
export type PortDrivingCSPReadRequest = RequestQuery<DomainCSP>;
export type PortDrivingCSPReadResponse = {
  data: DomainCSP[];
  pagination: { total: number };
};
