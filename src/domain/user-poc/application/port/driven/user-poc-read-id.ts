import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivenUserPOCReadID {
  read(
    data: PortDrivenUserPOCReadIDRequest,
  ): Promise<PortDrivenUserPOCReadIDResponse>;
}
export type PortDrivenUserPOCReadIDRequest = Pick<DomainUserPOC, "id">;
export type PortDrivenUserPOCReadIDResponse = DomainUserPOC;
