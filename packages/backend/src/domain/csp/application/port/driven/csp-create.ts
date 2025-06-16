import type { DomainCSP } from "../../domain/csp.ts";

export interface PortDrivenCSPCreate {
  create(
    data: PortDrivenCSPCreateRequest,
  ): Promise<PortDrivenCSPCreateResponse>;
}
export type PortDrivenCSPCreateRequest = DomainCSP;
export type PortDrivenCSPCreateResponse = void;
