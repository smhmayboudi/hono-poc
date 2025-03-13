import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivenUserPOCViewSearch {
  search(
    data: PortDrivenUserPOCViewSearchRequest,
  ): Promise<PortDrivenUserPOCViewSearchResponse>;
}
export type PortDrivenUserPOCViewSearchRequest = { query: string };
export type PortDrivenUserPOCViewSearchResponse = DomainUserPOCView[];
