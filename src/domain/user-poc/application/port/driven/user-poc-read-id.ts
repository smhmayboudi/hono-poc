import type { DomainUserPOC } from "../../domain/user-poc.ts";

export interface PortDrivenUserPOCReadID {
  readID(
    data: PortDrivenUserPOCReadIDRequest,
  ): Promise<PortDrivenUserPOCReadIDResponse>;
}
export type PortDrivenUserPOCReadIDRequest = Pick<DomainUserPOC, "id">;
export type PortDrivenUserPOCReadIDResponse = DomainUserPOC;
