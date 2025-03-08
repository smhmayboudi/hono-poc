import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivenUserPOCUpdate {
  update(
    data: PortDrivenUserPOCUpdateRequest,
  ): Promise<PortDrivenUserPOCUpdateResponse>;
}
export type PortDrivenUserPOCUpdateRequest = PartialUndefinable<
  Omit<DomainUserPOC, "id">
> &
  Readonly<Pick<DomainUserPOC, "id">>;
export type PortDrivenUserPOCUpdateResponse = void;
