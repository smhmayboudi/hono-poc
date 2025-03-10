import type { PortDrivingUseCase } from "../../../../../shared/application/port/driving/use-case.ts";
import type { PartialUndefinable } from "../../../../../shared/application/port/partial-undefinable.ts";
import type { DomainUserPOCInformation } from "../../domain/user-poc-information.ts";

export interface PortDrivingUserPOCInformationUpdateUserId
  extends PortDrivingUseCase<
    PortDrivingUserPOCInformationUpdateUserIdRequest,
    PortDrivingUserPOCInformationUpdateUserIdResponse
  > {
  execute(
    data: PortDrivingUserPOCInformationUpdateUserIdRequest,
  ): Promise<PortDrivingUserPOCInformationUpdateUserIdResponse>;
}
export type PortDrivingUserPOCInformationUpdateUserIdRequest =
  PartialUndefinable<Omit<DomainUserPOCInformation, "id" | "userId">> &
    Readonly<Pick<DomainUserPOCInformation, "userId">>;
export type PortDrivingUserPOCInformationUpdateUserIdResponse = Pick<
  DomainUserPOCInformation,
  "userId"
>;
