import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { DomainUserPOCView } from "../../domain/user-poc-view.ts";

export interface PortDrivingUserPOCViewSearch
  extends PortDrivingUseCase<
    PortDrivingUserPOCViewSearchRequest,
    PortDrivingUserPOCViewSearchResponse
  > {
  execute(
    data: PortDrivingUserPOCViewSearchRequest,
  ): Promise<PortDrivingUserPOCViewSearchResponse>;
}
export type PortDrivingUserPOCViewSearchRequest = { query: string };
export type PortDrivingUserPOCViewSearchResponse = DomainUserPOCView[];
