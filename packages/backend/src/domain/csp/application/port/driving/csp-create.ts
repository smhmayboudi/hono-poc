import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainCSP } from "../../domain/csp.ts";

export interface PortDrivingCSPCreate
  extends PortDrivingUseCase<
    PortDrivingCSPCreateRequest,
    PortDrivingCSPCreateResponse
  > {
  execute(
    data: PortDrivingCSPCreateRequest,
  ): Promise<PortDrivingCSPCreateResponse>;
}
export type PortDrivingCSPCreateRequest = Omit<DomainCSP, "id" | "timestamp">;
export type PortDrivingCSPCreateResponse = Pick<DomainCSP, "id" | "timestamp">;
